import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseClient'; // Use the admin client for server-side operations
import { nanoid } from 'nanoid'; // For generating unique IDs if needed, though Supabase UUIDs are preferred
import { genAI } from '@/lib/geminiClient'; // Import the Gemini client
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'; // For splitting text if needed for Gemini

// Function to get or create job title
async function getOrCreateJob(title: string): Promise<{ id: string; title: string }> {
  const { data, error: fetchError } = await supabaseAdmin
    .from('jobs')
    .select('id, title')
    .eq('title', title)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 means 'No rows found'
    throw new Error(`Error checking existing job: ${fetchError.message}`);
  }

  if (data) {
    return data; // Job exists
  }

  // Job doesn't exist, create it
  const { data: newJob, error: insertError } = await supabaseAdmin
    .from('jobs')
    .insert([{ title: title }])
    .select('id, title')
    .single();

  if (insertError) {
    throw new Error(`Error creating new job: ${insertError.message}`);
  }
  return newJob!;
}

// Function to generate AI content (description, seo) using Gemini
async function generateAIContent(jobTitle: string, companyName?: string, location?: string): Promise<{ description: string; seo_meta_title: string; seo_meta_description: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    // Prompt for job description
    const promptDescription = `Generate a concise and SEO-friendly job description for the role of "${jobTitle}"${companyName ? ` at ${companyName}` : ''}${location ? ` in ${location}` : ''}. Focus on key responsibilities, required skills, and benefits. Keep it under 150 words.`;
    const resultDescription = await model.generateContent(promptDescription);
    const description = resultDescription.response.text();

    // Prompt for SEO meta title
    const promptMetaTitle = `Generate an SEO-optimized meta title (max 60 characters) for a job page about "${jobTitle}"${companyName ? ` at ${companyName}` : ''}${location ? ` in ${location}` : ''}. Include salary information if generally known, or focus on seeking top talent.`;
    const resultMetaTitle = await model.generateContent(promptMetaTitle);
    const seo_meta_title = resultMetaTitle.response.text();

    // Prompt for SEO meta description
    const promptMetaDescription = `Generate an SEO-optimized meta description (max 160 characters) for a job page about "${jobTitle}"${companyName ? ` at ${companyName}` : ''}${location ? ` in ${location}` : ''}. Highlight key aspects like compensation range, location, and career growth opportunities.`;
    const resultMetaDescription = await model.generateContent(promptMetaDescription);
    const seo_meta_description = resultMetaDescription.response.text();

    return { description, seo_meta_title, seo_meta_description };
  } catch (error) {
    console.error("Error generating AI content:", error);
    // Return defaults or error messages if AI generation fails
    return {
      description: `Learn more about the ${jobTitle} role.`,
      seo_meta_title: `${jobTitle} Salary & Job Details`,
      seo_meta_description: `Find compensation data and career insights for ${jobTitle} roles.`
    };
  }
}

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const { jobTitle, companyName, location, baseSalary, totalComp, level, userNotes } = await request.json();

  // Basic Validation
  if (!jobTitle || !companyName || !totalComp || !location || !level) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Clean up currency inputs (remove commas, dollar signs, etc.)
  const cleanTotalComp = parseFloat(totalComp.replace(/[$,]/g, '')) || 0;
  const cleanBaseSalary = parseFloat(baseSalary.replace(/[$,]/g, '')) || 0;

  try {
    // 1. Insert into salaries table
    const { data: salaryData, error: salaryError } = await supabaseAdmin
      .from('salaries')
      .insert([
        {
          job_title: jobTitle,
          company_name: companyName,
          location: location,
          base_salary: cleanBaseSalary || null, // Store as null if not provided or invalid
          total_comp: cleanTotalComp,
          level: level,
          user_notes: userNotes || null,
        },
      ])
      .select('*')
      .single();

    if (salaryError) {
      console.error('Error inserting salary:', salaryError);
      return NextResponse.json({ error: 'Failed to save salary data' }, { status: 500 });
    }

    // 2. Handle Job Aggregation and AI Content Generation
    // Get or create the job entry in the 'jobs' table
    const jobEntry = await getOrCreateJob(jobTitle);
    
    // Fetch existing company and location data to update later if needed
    // For now, let's assume we update the job entry and potentially trigger updates for company/location later
    
    // Generate AI content for the job
    const aiContent = await generateAIContent(jobTitle, companyName, location);

    // Update the jobs table with aggregated stats and AI content
    // Note: Actual aggregation (median, min, max, count) would be more complex, possibly involving triggers or background jobs.
    // For now, we update the job entry with AI content and mock "updated" stats.
    // A more robust solution would involve calculating these from the 'salaries' table.
    const { error: jobUpdateError } = await supabaseAdmin
      .from('jobs')
      .update({
        description: aiContent.description,
        seo_meta_title: aiContent.seo_meta_title,
        seo_meta_description: aiContent.seo_meta_description,
        updated_at: new Date().toISOString(),
        // Mocking some aggregated stats for now - real calculation needed
        // global_median_comp: salaryData.total_comp, // This is just one entry, not an aggregate
        // global_count: 1 // Need to count total entries for this job title
      })
      .eq('id', jobEntry.id);

    if (jobUpdateError) {
      console.error('Error updating job entry:', jobUpdateError);
      // Decide if this is a critical failure or if we should proceed
    }

    // Potentially trigger updates for company and location tables here as well

    return NextResponse.json({ message: 'Salary data submitted successfully', salary: salaryData }, { status: 201 });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
