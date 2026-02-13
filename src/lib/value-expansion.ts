import { supabaseAdmin } from './supabaseClient';

export interface ValueBlock {
    title: string;
    type: 'market_position' | 'trend' | 'geographic_context' | 'top_payers' | 'related_entities';
    data: unknown;
    narrative?: string;
}

interface SalaryWithCompany {
    totalComp: number;
    Company: { name: string } | { name: string }[] | null;
}

interface SalaryWithRole {
    totalComp: number;
    Role: { title: string } | { title: string }[] | null;
}

export async function buildPageValueBlocks(
    entityType: 'Company' | 'Role' | 'Location',
    entityId: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _entityName: string
): Promise<ValueBlock[]> {
    const blocks: ValueBlock[] = [];

    // 1. Market Position Block (Percentiles)
    const positionBlock = await buildMarketPositionBlock(entityType, entityId);
    if (positionBlock) blocks.push(positionBlock);

    // 2. Top Payers / Locations / Jobs (Aggregation)
    const aggregationBlock = await buildAggregationBlock(entityType, entityId);
    if (aggregationBlock) blocks.push(aggregationBlock);

    // 3. Geographic Context (Locations only)
    if (entityType === 'Location') {
        const geoBlock = await buildGeographicContextBlock(entityId);
        if (geoBlock) blocks.push(geoBlock);
    }

    // 4. Role Breakdown (Companies only)
    if (entityType === 'Company') {
        const roleBlock = await buildRoleBreakdownBlock(entityId);
        if (roleBlock) blocks.push(roleBlock);
    }

    return blocks;
}

async function buildMarketPositionBlock(entityType: string, entityId: string): Promise<ValueBlock | null> {
    // Fetch aggregated stats from db
    // This is a simplified implementation. Real implementation needs robust queries.
    let queryField = '';
    if (entityType === 'Company') queryField = 'companyId';
    else if (entityType === 'Role') queryField = 'roleId';
    else if (entityType === 'Location') queryField = 'locationId';

    const { data } = await supabaseAdmin
        .from('Salary')
        .select('totalComp')
        .eq(queryField, entityId)
        .order('totalComp', { ascending: true });

    if (!data || data.length < 3) return null; // Not enough data for meaningful distribution

    const sorted = data.map(d => d.totalComp);
    const p25 = sorted[Math.floor(sorted.length * 0.25)];
    const median = sorted[Math.floor(sorted.length * 0.5)];
    const p75 = sorted[Math.floor(sorted.length * 0.75)];

    return {
        title: 'Market Position',
        type: 'market_position',
        data: { p25, median, p75, count: sorted.length },
        narrative: `The median total compensation is $${(median / 1000).toFixed(0)}k, ranging from $${(p25 / 1000).toFixed(0)}k (25th percentile) to $${(p75 / 1000).toFixed(0)}k (75th percentile).`
    };
}

async function buildAggregationBlock(entityType: string, entityId: string): Promise<ValueBlock | null> {
    if (entityType === 'Role') {
        const { data } = await supabaseAdmin.from('Salary')
            .select('totalComp, Company(name)')
            .eq('roleId', entityId)
            .order('totalComp', { ascending: false })
            .limit(50);

        if (!data || data.length === 0) return null;

        // Naive aggregation
        const map = new Map<string, number[]>();
        (data as SalaryWithCompany[]).forEach((d) => {
            const name = Array.isArray(d.Company) ? d.Company[0]?.name : d.Company?.name;
            if (name) {
                if (!map.has(name)) map.set(name, []);
                map.get(name)?.push(d.totalComp);
            }
        });

        const topCompanies = Array.from(map.entries()).map(([name, comps]) => ({
            name,
            median: comps.sort((a, b) => a - b)[Math.floor(comps.length / 2)]
        })).sort((a, b) => b.median - a.median).slice(0, 5);

        return {
            title: 'Top Paying Companies',
            type: 'top_payers',
            data: topCompanies
        };
    }
    return null;
}

async function buildGeographicContextBlock(locationId: string): Promise<ValueBlock | null> {
    const { data } = await supabaseAdmin.from('Salary')
        .select('totalComp, Role(title)')
        .eq('locationId', locationId)
        .order('totalComp', { ascending: false })
        .limit(50);

    if (!data || data.length === 0) return null;

    const map = new Map<string, number[]>();
    (data as SalaryWithRole[]).forEach((d) => {
        const title = Array.isArray(d.Role) ? d.Role[0]?.title : d.Role?.title;
        if (title) {
            if (!map.has(title)) map.set(title, []);
            map.get(title)?.push(d.totalComp);
        }
    });

    const topJobs = Array.from(map.entries()).map(([name, comps]) => ({
        name,
        median: comps.sort((a, b) => a - b)[Math.floor(comps.length / 2)]
    })).sort((a, b) => b.median - a.median).slice(0, 5);

    return {
        title: 'Top Paying Jobs',
        type: 'top_payers', // Reusing type for UI simplicity
        data: topJobs
    }
}

async function buildRoleBreakdownBlock(companyId: string): Promise<ValueBlock | null> {
    const { data } = await supabaseAdmin.from('Salary')
        .select('totalComp, Role(title)')
        .eq('companyId', companyId)
        .order('totalComp', { ascending: false })
        .limit(50);

    if (!data || data.length === 0) return null;

    const map = new Map<string, number[]>();
    (data as SalaryWithRole[]).forEach((d) => {
        const title = Array.isArray(d.Role) ? d.Role[0]?.title : d.Role?.title;
        if (title) {
            if (!map.has(title)) map.set(title, []);
            map.get(title)?.push(d.totalComp);
        }
    });

    const roles = Array.from(map.entries()).map(([name, comps]) => ({
        name,
        median: comps.sort((a, b) => a - b)[Math.floor(comps.length / 2)]
    })).sort((a, b) => b.median - a.median).slice(0, 5);

    return {
        title: 'Salaries by Role',
        type: 'top_payers', // Reusing type
        data: roles
    }
}
