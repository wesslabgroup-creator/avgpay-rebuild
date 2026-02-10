import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { genAI } from '@/lib/geminiClient';

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
function normalizeJobTitle(title: string): string {
  const lowerTitle = title.toLowerCase().trim();
  return JOB_ALIASES[lowerTitle] || title.trim();
}

// Function to get or create job title with fuzzy matching
async function getOrCreateJob(title: string): Promise<{ id: string; title: string; isNew: boolean }> {
  // First, normalize using aliases
  const normalizedTitle = normalizeJobTitle(title);

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

// Function to generate AI content for companies
async function generateCompanyAIContent(companyName: string): Promise<{ description: string; seo_meta_title: string; seo_meta_description: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const promptDescription = `Generate a concise description (under 100 words) about "${companyName}" as an employer, focusing on company culture, industry position, and what makes it attractive for tech professionals.`;
    const resultDescription = await model.generateContent(promptDescription);
    const description = resultDescription.response.text();

    const promptMetaTitle = `Generate an SEO-optimized meta title (max 60 characters) for a salary page about "${companyName}".`;
    const resultMetaTitle = await model.generateContent(promptMetaTitle);
    const seo_meta_title = resultMetaTitle.response.text();

    const promptMetaDescription = `Generate an SEO-optimized meta description (max 160 characters) for a salary page about "${companyName}". Highlight compensation insights and career opportunities.`;
    const resultMetaDescription = await model.generateContent(promptMetaDescription);
    const seo_meta_description = resultMetaDescription.response.text();

    return { description, seo_meta_title, seo_meta_description };
  } catch (error) {
    console.error("Error generating company AI content:", error);
    return {
      description: `Explore salary data and career opportunities at ${companyName}.`,
      seo_meta_title: `${companyName} Salaries & Compensation`,
      seo_meta_description: `Discover compensation data for ${companyName} employees.`
    };
  }
}

// Function to generate AI content for locations
async function generateLocationAIContent(locationName: string): Promise<{ description: string; seo_meta_title: string; seo_meta_description: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const promptDescription = `Generate a concise description (under 100 words) about "${locationName}" as a tech job market, focusing on cost of living, major employers, and quality of life for tech professionals.`;
    const resultDescription = await model.generateContent(promptDescription);
    const description = resultDescription.response.text();

    const promptMetaTitle = `Generate an SEO-optimized meta title (max 60 characters) for a tech salary page about "${locationName}".`;
    const resultMetaTitle = await model.generateContent(promptMetaTitle);
    const seo_meta_title = resultMetaTitle.response.text();

    const promptMetaDescription = `Generate an SEO-optimized meta description (max 160 characters) for a tech salary page about "${locationName}". Highlight local compensation trends.`;
    const resultMetaDescription = await model.generateContent(promptMetaDescription);
    const seo_meta_description = resultMetaDescription.response.text();

    return { description, seo_meta_title, seo_meta_description };
  } catch (error) {
    console.error("Error generating location AI content:", error);
    return {
      description: `Explore tech salaries in ${locationName}.`,
      seo_meta_title: `Tech Salaries in ${locationName}`,
      seo_meta_description: `Discover compensation data for tech professionals in ${locationName}.`
    };
  }
}

// Get or create company with AI content
async function getOrCreateCompany(companyName: string): Promise<{ id: string; name: string; isNew: boolean }> {
  const normalizedName = companyName.trim();

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

  // Create new company with AI content
  await generateCompanyAIContent(normalizedName);

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

  console.log(`New company created with AI content: "${normalizedName}"`);
  return { ...newCompany!, isNew: true };
}

// Get or create location with AI content
async function getOrCreateLocation(locationName: string): Promise<{ id: string; name: string; isNew: boolean }> {
  const parts = locationName.split(',').map(p => p.trim());
  const city = parts[0];
  const state = parts[1] || 'US';
  const fullName = parts[1] ? `${city}, ${state}` : city;

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

  // Create new location with AI content
  await generateLocationAIContent(fullName);

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

  console.log(`New location created with AI content: "${fullName}"`);
  return { ...newLocation!, isNew: true };
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const { jobTitle, companyName, location, baseSalary, totalComp, level } = await request.json();

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

    // 3. If the job is new, we skip AI content update for now as the schema doesn't support it
    if (jobEntry.isNew) {
      console.log('New job created, skipping AI content update (schema mismatch)');
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
