
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Initialize Supabase Client directly for script context
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ThinContentReport {
    entityType: 'Company' | 'Role' | 'Location';
    id: string;
    name: string;
    slug: string;
    salaryCount: number;
    hasAnalysis: boolean;
    descriptionLength?: number;
    riskScore: number;
    issues: string[];
}

async function auditCompanies(): Promise<ThinContentReport[]> {
    // Fetch companies with salary counts
    // Note: supabase-js doesn't support deep relations count easily in one query without foreign tables setup
    // We will do a rough check.

    const { data: companies, error } = await supabase
        .from('Company')
        .select('id, name, slug, analysis, salaries:Salary(count)'); // Requires foreign key setup but let's try.

    if (error) {
        // Fallback: fetch companies then salaries count separately if relation query fails
        console.warn("Relation fetch might fail if not set up in PostgREST. Falling back to simple fetch.");
        const { data: rawCompanies } = await supabase.from('Company').select('id, name, slug, analysis');
        if (!rawCompanies) return [];

        const reports: ThinContentReport[] = [];
        for (const c of rawCompanies) {
            const { count } = await supabase.from('Salary').select('*', { count: 'exact', head: true }).eq('companyId', c.id);
            const salaryCount = count || 0;

            const issues: string[] = [];
            let score = 0;

            if (salaryCount < 3) {
                issues.push('Very low salary data (< 3)');
                score += 50;
            } else if (salaryCount < 10) {
                issues.push('Low salary data (< 10)');
                score += 20;
            }

            if (!c.analysis) {
                issues.push('Missing AI analysis');
                score += 30;
            }

            reports.push({
                entityType: 'Company',
                id: c.id,
                name: c.name,
                slug: c.slug,
                salaryCount,
                hasAnalysis: !!c.analysis,
                riskScore: Math.min(score, 100),
                issues
            });
        }
        return reports;
    }

    // If relation worked (it returns array of count objects usually)
    // But safest is the loop for now given constraints/uncertainty of PostgREST config
    return [];
}

// Since relation query is tricky without specific setup, let's use a robust batched approach or just simple loop for script 
// For now, simple loop is fine for < 1000 entities. If larger, we'd need RPC.

async function auditEntities(type: 'Company' | 'Role' | 'Location', table: string, salaryFk: string): Promise<ThinContentReport[]> {
    console.log(`Auditing ${type}...`);
    const { data: entities, error } = await supabase.from(table).select('id, slug, analysis, ' + (type === 'Role' ? 'title' : (type === 'Company' ? 'name' : 'city')));

    if (error || !entities) {
        console.error(`Error fetching ${table}:`, error);
        return [];
    }

    const reports: ThinContentReport[] = [];

    // Optimization: Fetch all salaries grouped by FK is effectively "select fk, count(*) from salary group by fk"
    // But Supabase JS doesn't do group by easily.
    // We will just do a loop for this MVP script.

    for (const e of (entities as any[])) {
        const name = type === 'Role' ? e.title : (type === 'Company' ? e.name : `${e.city}`);

        const { count } = await supabase.from('Salary').select('*', { count: 'exact', head: true }).eq(salaryFk, e.id);
        const salaryCount = count || 0;

        const issues: string[] = [];
        let score = 0;

        if (salaryCount < 3) {
            issues.push('Very low salary data (< 3)');
            score += 50;
        } else if (salaryCount < 10) {
            issues.push('Low salary data (< 10)');
            score += 20;
        }

        if (!e.analysis) {
            issues.push('Missing AI analysis');
            score += 30;
        }

        reports.push({
            entityType: type,
            id: e.id,
            name: name,
            slug: e.slug,
            salaryCount,
            hasAnalysis: !!e.analysis,
            riskScore: Math.min(score, 100),
            issues
        });
    }
    return reports;
}

async function main() {
    // Audit Companies
    const companyReports = await auditEntities('Company', 'Company', 'companyId');
    const roleReports = await auditEntities('Role', 'Role', 'roleId');
    const locationReports = await auditEntities('Location', 'Location', 'locationId');

    const allReports = [...companyReports, ...roleReports, ...locationReports];
    const highRisk = allReports.filter((r) => r.riskScore >= 50);

    const summary = {
        totalEntities: allReports.length,
        highRiskCount: highRisk.length,
        companies: {
            total: companyReports.length,
            highRisk: companyReports.filter((r) => r.riskScore >= 50).length,
        },
        roles: {
            total: roleReports.length,
            highRisk: roleReports.filter((r) => r.riskScore >= 50).length,
        },
        locations: {
            total: locationReports.length,
            highRisk: locationReports.filter((r) => r.riskScore >= 50).length,
        },
        timestamp: new Date().toISOString(),
    };

    console.log('Audit Complete.');
    console.log(JSON.stringify(summary, null, 2));

    const outputPath = path.join(process.cwd(), 'thin_content_report.json');
    fs.writeFileSync(outputPath, JSON.stringify({ summary, details: allReports }, null, 2));
    console.log(`Full report written to ${outputPath}`);
}

main();
