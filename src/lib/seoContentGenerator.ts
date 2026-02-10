import { genAI } from '@/lib/geminiClient';

// ── Types ───────────────────────────────────────────────────────────────────

export type EntityType = 'Company' | 'City' | 'Job';

export interface SEOContentRequest {
  entityType: EntityType;
  entityName: string;
  contextData: string;
}

export interface CompanyContent {
  comp_philosophy: string;
  benefit_sentiment: string;
  hiring_bar: string;
  [key: string]: string; // dynamic keys
}

export interface CityContent {
  buying_power: string;
  market_drivers: string;
  lifestyle_economics: string;
  [key: string]: string;
}

export interface JobContent {
  career_leverage: string;
  skill_premium: string;
  remote_viability: string;
  [key: string]: string;
}

export type SEOContentResponse = CompanyContent | CityContent | JobContent;

// ── System Prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Lead Data Analyst for AvgPay, a salary transparency platform. Your goal is to write "Timeless Financial Analysis" that explains the *mechanisms* of compensation, not current market news.

OBJECTIVE:
Analyze the provided Entity and return a structured JSON object containing high-value, evergreen financial context.

CRITICAL CONSTRAINTS (Violating these = Failure):
1. TIMELESSNESS: Do NOT use time-anchored words like "currently", "recently", "this year", "2024", "2025", "post-pandemic", or "now". Instead, use "Typically", "Historically", "Market structures suggest", or "Standard practice involves".
2. NO HARD NUMBERS: Do NOT mention specific salary figures (e.g., "$150k") or stock prices. The frontend displays the live data; your job is to explain the *structural context* (e.g., "High cost of living offsets high wages").
3. NO FLUFF: Do NOT write generic introductions (e.g., "Austin is a beautiful city"). Go immediately to financial, tax, and career leverage analysis.
4. VALUE LENS: Every sentence must answer "How does this affect the user's paycheck, career growth, or purchasing power?"

UNIQUENESS REQUIREMENT:
Each entity must receive COMPLETELY DISTINCT analysis. Do NOT reuse generic phrases across entities.
- For Companies: Reference the specific industry vertical, public/private status, company size tier, and known compensation structure.
- For Cities: Reference the specific state tax code, metro area characteristics, dominant employer base, and geographic cost factors.
- For Jobs: Reference the specific career ladder, adjacent roles, automation risk, and demand curve for this particular title.
You MUST add at least one dynamic key that is specific to THIS entity and would not appear on any other entity's page.

DYNAMIC SCHEMA EXPANSION:
If you identify a highly relevant data point or insight for this specific entity that does not fit into the standard keys, you are authorized to ADD a new key-value pair to the JSON.
- Example: If a city has a specific tax loophole, add a key: "tax_advantage_alert".
- Example: If a company has a notorious vesting schedule, add a key: "vesting_warning".
- Example: If a job has a known certification premium, add a key: "certification_roi".

OUTPUT INSTRUCTION:
Return ONLY valid JSON matching the structure below based on the Entity Type.

---

IF ENTITY_TYPE == "Company":
{
  "comp_philosophy": "Explain how this company/industry typically constructs pay (e.g., heavy RSU component vs. high base salary). Mention stability vs. risk.",
  "benefit_sentiment": "Analyze standard non-monetary benefits for this tier of employer (e.g., 'Remote-first', 'Unlimited PTO', '401k match').",
  "hiring_bar": "Describe the typical interview rigor and soft skills valued by this organization.",
  "[OPTIONAL_DYNAMIC_KEY]": "High-value insight specific to this company."
}

IF ENTITY_TYPE == "City":
{
  "buying_power": "Analyze the impact of local taxes (e.g., No State Income Tax) and Cost of Living on net take-home pay.",
  "market_drivers": "Identify the dominant industries in this city that influence the salary floor.",
  "lifestyle_economics": "Analyze hidden financial costs of living here (e.g., 'High commuter costs due to sprawl', 'Seasonal energy spikes').",
  "[OPTIONAL_DYNAMIC_KEY]": "High-value insight specific to this city."
}

IF ENTITY_TYPE == "Job":
{
  "career_leverage": "Explain the typical progression (Individual Contributor vs. Management) and how seniority impacts leverage.",
  "skill_premium": "Identify high-value skills/certifications that typically push salaries to the top of the band.",
  "remote_viability": "Analyze if this role is historically remote-friendly and if location-based pay adjustments are standard.",
  "[OPTIONAL_DYNAMIC_KEY]": "High-value insight specific to this job."
}`;

// ── Required keys per entity type (for validation) ──────────────────────────

const REQUIRED_KEYS: Record<EntityType, string[]> = {
  Company: ['comp_philosophy', 'benefit_sentiment', 'hiring_bar'],
  City: ['buying_power', 'market_drivers', 'lifestyle_economics'],
  Job: ['career_leverage', 'skill_premium', 'remote_viability'],
};

// ── Fallback content when API fails ─────────────────────────────────────────

function getFallbackContent(entityType: EntityType, entityName: string): SEOContentResponse {
  switch (entityType) {
    case 'Company':
      return {
        comp_philosophy: `Compensation structures at ${entityName} typically reflect industry norms, balancing base salary with equity and performance bonuses.`,
        benefit_sentiment: `Standard benefits at employers of this tier historically include health coverage, retirement matching, and professional development budgets.`,
        hiring_bar: `Interview processes at ${entityName} generally involve technical and behavioral assessments calibrated to the seniority of the role.`,
      };
    case 'City':
      return {
        buying_power: `Take-home pay in ${entityName} is shaped by the local tax structure and cost of living, which together determine real purchasing power.`,
        market_drivers: `The salary floor in ${entityName} is historically influenced by the dominant industries in the metro area.`,
        lifestyle_economics: `Hidden costs such as housing, transportation, and energy expenses affect net disposable income in ${entityName}.`,
      };
    case 'Job':
      return {
        career_leverage: `Career progression for this role typically follows Individual Contributor or Management tracks, with compensation scaling at each level.`,
        skill_premium: `Specialized skills and industry certifications historically push compensation toward the top of the pay band for this role.`,
        remote_viability: `Remote work availability for this role varies by employer, with some organizations applying location-based pay adjustments.`,
      };
  }
}

// ── Core generator function ─────────────────────────────────────────────────

/**
 * Generates SEO-optimized "Timeless Financial Analysis" content for an entity
 * using the Google Gemini API.
 *
 * @param entityType - "Company", "City", or "Job"
 * @param entityName - e.g., "Google", "Austin, TX", "Product Manager"
 * @param contextData - e.g., "Tech Industry, Public Company" or "State: Texas, No Income Tax"
 * @returns Structured JSON content matching the entity type schema
 */
export async function generateSEOFinancialContent(
  entityType: EntityType,
  entityName: string,
  contextData: string,
): Promise<SEOContentResponse> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = [
      `Entity Type: ${entityType}`,
      `Entity Name: ${entityName}`,
      `Context: ${contextData}`,
      ``,
      `IMPORTANT: Write analysis that is specific to "${entityName}" and could NOT be copy-pasted onto any other ${entityType.toLowerCase()} page. Reference unique structural characteristics of this entity.`,
    ].join('\n');

    const result = await model.generateContent(userPrompt);
    const responseText = result.response.text();

    const parsed = JSON.parse(responseText) as SEOContentResponse;

    // Validate that all required keys exist for the entity type
    const requiredKeys = REQUIRED_KEYS[entityType];
    for (const key of requiredKeys) {
      if (typeof parsed[key] !== 'string' || parsed[key].trim() === '') {
        console.error(`Missing or empty required key "${key}" in Gemini response for ${entityType}: ${entityName}`);
        return getFallbackContent(entityType, entityName);
      }
    }

    return parsed;
  } catch (error) {
    console.error('Error generating SEO financial content:', error);
    return getFallbackContent(entityType, entityName);
  }
}
