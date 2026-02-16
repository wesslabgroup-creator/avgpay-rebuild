import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { queueEnrichment, buildCityContextData } from '@/lib/enrichment';
import { log } from '@/lib/enrichmentLogger';
import { normalizeCompanyName, normalizeJobTitle, normalizeCityName } from '@/lib/normalization';

// Levenshtein distance for fuzzy matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const aLower = a.toLowerCase().trim();
  const bLower = b.toLowerCase().trim();

  if (aLower.length === 0) return bLower.length;
  if (bLower.length === 0) return aLower.length;

  for (let i = 0; i <= bLower.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= aLower.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= bLower.length; i++) {
    for (let j = 1; j <= aLower.length; j++) {
      if (bLower.charAt(i - 1) === aLower.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[bLower.length][aLower.length];
}

// Calculate similarity percentage (0-100)
function calculateSimilarity(a: string, b: string): number {
  const distance = levenshteinDistance(a, b);
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 100;
  return ((maxLength - distance) / maxLength) * 100;
}

// Common job title aliases for direct matching
const JOB_ALIASES: Record<string, string> = {
  'sde': 'Software Engineer',
  'swe': 'Software Engineer',
  'software dev': 'Software Engineer',
  'software developer': 'Software Engineer',
  'pm': 'Product Manager',
  'product mgr': 'Product Manager',
  'ds': 'Data Scientist',
  'ml engineer': 'Machine Learning Engineer',
  'mle': 'Machine Learning Engineer',
  'fe': 'Frontend Engineer',
  'frontend dev': 'Frontend Engineer',
  'be': 'Backend Engineer',
  'backend dev': 'Backend Engineer',
  'devops': 'DevOps Engineer',
  'sre': 'Site Reliability Engineer',
  'ux designer': 'UX Designer',
  'ui designer': 'UI Designer',
  'qa': 'QA Engineer',
  'qa engineer': 'QA Engineer',
  'eng manager': 'Engineering Manager',
  'em': 'Engineering Manager',
};

// Normalize job title using aliases
function resolveJobTitleAliases(title: string): string {
  const lowerTitle = title.toLowerCase().trim();
  return JOB_ALIASES[lowerTitle] || title.trim();
}

// Function to get or create job title with fuzzy matching
async function getOrCreateJob(title: string): Promise<{ id: string; title: string; isNew: boolean }> {
  // First, normalize using aliases
  const aliasedTitle = resolveJobTitleAliases(title);
  const normalizedInput = normalizeJobTitle(aliasedTitle);
  const normalizedTitle = normalizedInput.displayName;

  // Check for exact match first
  const { data: exactMatch, error: exactError } = await (supabaseAdmin
    .from('Role')
    .select('id, title')
    .eq('title', normalizedTitle)
    .single());

  if (exactError && exactError.code !== 'PGRST116') {
    throw new Error(`Error checking existing job: ${exactError.message}`);
  }

  if (exactMatch) {
    return { ...exactMatch, isNew: false };
  }

  // No exact match, check for fuzzy match among existing jobs
  const { data: allJobs, error: allJobsError } = await (supabaseAdmin
    .from('Role')
    .select('id, title'));

  if (allJobsError) {
    throw new Error(`Error fetching jobs for fuzzy matching: ${allJobsError.message}`);
  }

  const SIMILARITY_THRESHOLD = 80; // 80% similarity threshold
  let bestMatch: { id: string; title: string } | null = null;
  let highestSimilarity = 0;

  if (allJobs && allJobs.length > 0) {
    for (const job of allJobs) {
      const similarity = calculateSimilarity(normalizedTitle, job.title);
      if (similarity >= SIMILARITY_THRESHOLD && similarity > highestSimilarity) {
        highestSimilarity = similarity;
        bestMatch = job;
      }
    }
  }

  if (bestMatch) {
    // Found a similar job title, use the existing one
    console.log(`Fuzzy match found: "${normalizedTitle}" matched to "${bestMatch.title}" (${highestSimilarity.toFixed(1)}% similarity)`);
    return { ...bestMatch, isNew: false };
  }

  // No match found, create a new job entry
  const { data: newJob, error: insertError } = await (supabaseAdmin
    .from('Role')
    .insert([{
      id: crypto.randomUUID(),
      title: normalizedTitle,
      slug: normalizedTitle.toLowerCase().replace(/ /g, '-'),
      canonicalTitle: normalizedTitle
    }])
    .select('id, title')
    .single());

  if (insertError) {
    throw new Error(`Error creating new job: ${insertError.message}`);
  }

  console.log(`New job created: "${normalizedTitle}"`);
  return { ...newJob!, isNew: true };
}

// Get or create company
async function getOrCreateCompany(companyName: string): Promise<{ id: string; name: string; isNew: boolean }> {
  const { displayName } = normalizeCompanyName(companyName);
  const normalizedName = displayName;

  const { data: existingCompany, error: fetchError } = await (supabaseAdmin
    .from('Company')
    .select('id, name')
    .eq('name', normalizedName)
    .single());

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Error checking existing company: ${fetchError.message}`);
  }

  if (existingCompany) {
    return { ...existingCompany, isNew: false };
  }

  // Create new company record (deep analysis is queued separately after salary insertion)
  const { data: newCompany, error: insertError } = await (supabaseAdmin
    .from('Company')
    .insert([{
      id: crypto.randomUUID(),
      name: normalizedName,
      slug: normalizedName.toLowerCase().replace(/ /g, '-'),
      updatedAt: new Date().toISOString(),
    }])
    .select('id, name')
    .single());

  if (insertError) {
    throw new Error(`Error creating new company: ${insertError.message}`);
  }

  console.log(`New company created: "${normalizedName}"`);
  return { ...newCompany!, isNew: true };
}

// Get or create location with AI content
async function getOrCreateLocation(locationName: string): Promise<{ id: string; name: string; isNew: boolean }> {
  const { displayName } = normalizeCityName(locationName);
  const parts = displayName.split(',').map(p => p.trim());
  const city = parts[0];
  const state = parts[1] || 'US';
  const fullName = displayName;

  const { data: existingLocation, error: fetchError } = await (supabaseAdmin
    .from('Location')
    .select('id, city, state')
    .ilike('city', city)
    .ilike('state', state)
    .maybeSingle());

  if (fetchError) {
    throw new Error(`Error checking existing location: ${fetchError.message}`);
  }

  if (existingLocation) {
    return { id: existingLocation.id, name: `${existingLocation.city}, ${existingLocation.state}`, isNew: false };
  }

  // Create new location record (deep analysis is queued separately after salary insertion)
  const { data: newLocation, error: insertError } = await (supabaseAdmin
    .from('Location')
    .insert([{
      id: crypto.randomUUID(),
      city,
      state,
      metro: city,
      slug: fullName.toLowerCase().replace(/ /g, '-').replace(',', ''),
    }])
    .select('id, city, state')
    .single());

  if (insertError) {
    throw new Error(`Error creating new location: ${insertError.message}`);
  }

  console.log(`New location created: "${fullName}"`);
  return { id: newLocation!.id, name: `${newLocation!.city}, ${newLocation!.state}`, isNew: true };
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const { jobTitle, companyName, location, baseSalary, totalComp, level } = await request.json();

  log('info', 'salary_submission_received', 'New salary submission', {
    jobTitle, companyName, location, baseSalary, totalComp, level,
  });

  // Basic Validation
  if (!jobTitle || !companyName || !totalComp || !location || !level) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Clean up currency inputs (remove commas, dollar signs, etc.)
  const cleanTotalComp = parseFloat(String(totalComp).replace(/[$,]/g, '')) || 0;
  const cleanBaseSalary = baseSalary ? parseFloat(String(baseSalary).replace(/[$,]/g, '')) : null;

  // Data Quality Check - reject outliers
  if (cleanTotalComp < 10000 || cleanTotalComp > 5000000) {
    return NextResponse.json({ error: 'Total compensation seems unrealistic. Please enter a valid amount.' }, { status: 400 });
  }

  try {
    // 1. Get or create job, company, and location entries with fuzzy matching and AI content
    const [jobEntry, companyEntry, locationEntry] = await Promise.all([
      getOrCreateJob(jobTitle),
      getOrCreateCompany(companyName),
      getOrCreateLocation(location),
    ]);

    // Use the normalized job title from the matched/created job entry
    const normalizedJobTitle = jobEntry.title;

    // 2. Insert into Salary table
    const { data: salaryData, error: salaryError } = await (supabaseAdmin
      .from('Salary')
      .insert([
        {
          id: crypto.randomUUID(),
          roleId: jobEntry.id,
          companyId: companyEntry.id,
          locationId: locationEntry.id,
          baseSalary: Math.round(cleanBaseSalary || 0),
          totalComp: Math.round(cleanTotalComp),
          level: level,
          source: 'user',
          verified: false,
        },
      ])
      .select('*')
      .single());

    if (salaryError) {
      console.error('Error inserting salary:', salaryError);
      return NextResponse.json({ error: 'Failed to save salary data' }, { status: 500 });
    }

    // 3. Queue enrichment for ALL entities missing analysis (not just new ones)
    //    This is idempotent — queueEnrichment deduplicates via entityKey.
    log('info', 'enrichment_check', 'Checking entities for missing analysis', {
      companyId: companyEntry.id,
      companyName: companyEntry.name,
      companyIsNew: companyEntry.isNew,
      jobId: jobEntry.id,
      jobTitle: jobEntry.title,
      jobIsNew: jobEntry.isNew,
      locationId: locationEntry.id,
      locationName: locationEntry.name,
      locationIsNew: locationEntry.isNew,
    });

    const enrichmentPromises: Promise<string | null>[] = [];

    // Check company analysis — always, not just for new entities
    const { data: companyRecord } = await supabaseAdmin
      .from('Company')
      .select('analysis, enrichmentStatus')
      .eq('id', companyEntry.id)
      .single();

    if (!companyRecord?.analysis || companyRecord.enrichmentStatus === 'error') {
      log('info', 'enrichment_decision', `Enqueuing Company enrichment: analysis=${!!companyRecord?.analysis}, status=${companyRecord?.enrichmentStatus}`, {
        entityType: 'Company', entityId: companyEntry.id, entityName: companyEntry.name,
      });
      enrichmentPromises.push(
        queueEnrichment('Company', companyEntry.id, companyEntry.name)
      );
    } else {
      log('info', 'enrichment_decision', `Skipping Company enrichment: analysis exists`, {
        entityType: 'Company', entityId: companyEntry.id,
      });
    }

    // Check job analysis — always
    const { data: roleRecord } = await supabaseAdmin
      .from('Role')
      .select('analysis, enrichmentStatus')
      .eq('id', jobEntry.id)
      .single();

    if (!roleRecord?.analysis || roleRecord.enrichmentStatus === 'error') {
      log('info', 'enrichment_decision', `Enqueuing Job enrichment: analysis=${!!roleRecord?.analysis}, status=${roleRecord?.enrichmentStatus}`, {
        entityType: 'Job', entityId: jobEntry.id, entityName: jobEntry.title,
      });
      enrichmentPromises.push(
        queueEnrichment('Job', jobEntry.id, jobEntry.title)
      );
    } else {
      log('info', 'enrichment_decision', `Skipping Job enrichment: analysis exists`, {
        entityType: 'Job', entityId: jobEntry.id,
      });
    }

    // Check location analysis — always
    const { displayName: locDisplayName } = normalizeCityName(locationEntry.name);
    const locParts = locDisplayName.split(',').map((p: string) => p.trim());
    const city = locParts[0];
    const state = locParts[1] || '';

    const { data: locRecord } = await supabaseAdmin
      .from('Location')
      .select('analysis, enrichmentStatus')
      .eq('id', locationEntry.id)
      .single();

    if (!locRecord?.analysis || locRecord.enrichmentStatus === 'error') {
      log('info', 'enrichment_decision', `Enqueuing City enrichment: analysis=${!!locRecord?.analysis}, status=${locRecord?.enrichmentStatus}`, {
        entityType: 'City', entityId: locationEntry.id, entityName: locationEntry.name,
      });
      const cityContext = buildCityContextData({ city, state });
      enrichmentPromises.push(
        queueEnrichment('City', locationEntry.id, locationEntry.name, cityContext)
      );
    } else {
      log('info', 'enrichment_decision', `Skipping City enrichment: analysis exists`, {
        entityType: 'City', entityId: locationEntry.id,
      });
    }

    // Persist enrichment queue entries before returning the response.
    // In serverless runtimes, fire-and-forget work can be dropped when the
    // request lifecycle ends, causing entities to remain stuck at "none".
    if (enrichmentPromises.length > 0) {
      const results = await Promise.allSettled(enrichmentPromises);
      const queued = results.filter(r => r.status === 'fulfilled' && r.value !== null).length;
      const skipped = results.length - queued;
      log('info', 'enrichment_queued', `Queued ${queued} enrichment job(s), ${skipped} skipped/deduped from salary submission`);
    }

    return NextResponse.json({
      message: 'Salary data submitted successfully',
      salary: salaryData,
      job: normalizedJobTitle,
      company: companyEntry.name,
      location: locationEntry.name
    }, { status: 201 });

  } catch (error: unknown) {
    console.error('API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
