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
  equity_structure: string;
  benefit_sentiment: string;
  hiring_bar: string;
  negotiation_leverage: string;
  career_trajectory: string;
  work_culture_impact: string;
  [key: string]: string;
}

export interface CityContent {
  buying_power: string;
  tax_landscape: string;
  market_drivers: string;
  housing_affordability: string;
  lifestyle_economics: string;
  commute_and_infrastructure: string;
  relocation_considerations: string;
  [key: string]: string;
}

export interface JobContent {
  career_leverage: string;
  skill_premium: string;
  total_comp_anatomy: string;
  negotiation_tips: string;
  remote_viability: string;
  adjacent_roles: string;
  demand_resilience: string;
  [key: string]: string;
}

export type SEOContentResponse = CompanyContent | CityContent | JobContent;

// ── System Prompt ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Lead Compensation Analyst for AvgPay, a salary transparency platform trusted by professionals to make career-critical financial decisions. Your role is to produce "Structural Financial Analysis" — deep, expert-grade insight that explains the mechanisms behind compensation, not surface-level summaries.

OBJECTIVE:
For the given Entity, return a structured JSON object with 7+ substantive sections. Each section must be 3-5 sentences of analytical prose. Write as if briefing a senior professional who is evaluating an offer or planning a career move.

VOICE & AUTHORITY:
- Write in the voice of an analyst who has studied thousands of compensation data points.
- Use precise financial and HR terminology (e.g., "total addressable compensation", "equity vesting cliff", "geographic pay differential", "cost-of-living adjustment band").
- Reference structural mechanisms: tax codes, equity models, industry benchmarking, labor supply/demand dynamics.

CRITICAL CONSTRAINTS (Violating these = Failure):
1. TIMELESSNESS: Do NOT use time-anchored words like "currently", "recently", "this year", "2024", "2025", "2026", "post-pandemic", or "now". Use "Typically", "Historically", "Market structures indicate", or "Standard practice involves".
2. NO HARD NUMBERS: Do NOT mention specific salary figures (e.g., "$150k"), stock prices, or exact percentages. The frontend displays live data. Your job is structural context (e.g., "The equity-heavy compensation model creates significant upside variance").
3. NO FLUFF: Never write generic introductions. Every sentence must deliver analytical value. Open each section with the strongest insight, not background.
4. VALUE LENS: Every sentence must answer "How does this affect the reader's paycheck, career growth, negotiating position, or purchasing power?"
5. DEPTH OVER BREADTH: 3-5 substantive sentences per section. Each sentence should carry a distinct insight. No filler.

UNIQUENESS REQUIREMENT:
Each entity MUST receive completely distinct analysis that could NOT be copy-pasted to any other entity's page.
- Reference specific structural characteristics: industry vertical, public/private status, geographic tax code, metro characteristics, career ladder shape, adjacent role ecosystem.
- You MUST include at least one dynamic key with a unique insight for THIS entity.

DYNAMIC SCHEMA EXPANSION:
You are authorized to ADD key-value pairs for highly specific insights:
- "vesting_warning": If equity has a known cliff or back-loading pattern
- "tax_advantage_alert": If a jurisdiction has unusual tax treatment
- "certification_roi": If a specific cert commands a premium
- "golden_handcuffs_risk": If retention mechanisms are aggressive
- "cost_trap": If a hidden cost significantly impacts net income

OUTPUT:
Return ONLY valid JSON. Each value must be 3-5 sentences of expert prose (not bullet points).

---

IF ENTITY_TYPE == "Company":
{
  "comp_philosophy": "Deep analysis of how this employer structures total compensation. Explain the base-to-equity ratio, whether comp is front-loaded or back-loaded, and how this compares to the employer's competitive set. 3-5 sentences.",
  "equity_structure": "Analyze the equity component: RSU vs options, vesting schedule shape (cliff, linear, back-loaded), refresh grant patterns, and how equity risk maps to company stage. 3-5 sentences.",
  "benefit_sentiment": "Evaluate non-monetary compensation: healthcare tier, 401k match mechanics, PTO structure, parental leave, and how these benefits compare within the industry segment. 3-5 sentences.",
  "hiring_bar": "Describe interview rigor, process structure, typical rounds, and the specific technical and behavioral competencies this employer screens for. 3-5 sentences.",
  "negotiation_leverage": "Advise on where candidates historically have leverage in the offer process: which comp components are flexible, what competing offers unlock, and common counter-offer patterns. 3-5 sentences.",
  "career_trajectory": "Analyze internal mobility: promotion velocity, leveling system transparency, whether lateral moves are common, and how tenure maps to compensation growth. 3-5 sentences.",
  "work_culture_impact": "Assess how work expectations (on-call, pace, hours) affect the effective hourly rate and long-term earning capacity. 3-5 sentences."
}

IF ENTITY_TYPE == "City":
{
  "buying_power": "Analyze net take-home pay after state and local taxes. Explain the effective tax burden compared to other major tech markets and how it impacts real purchasing power. 3-5 sentences.",
  "tax_landscape": "Detail the state income tax structure, any local/city taxes, property tax rates, sales tax, and how these compound to affect disposable income for tech professionals. 3-5 sentences.",
  "market_drivers": "Identify the dominant industries and anchor employers that set the salary floor and ceiling in this metro. Explain the supply/demand dynamics for tech talent. 3-5 sentences.",
  "housing_affordability": "Analyze housing costs relative to tech salaries: rent-to-income ratios, mortgage accessibility, and whether homeownership is realistic on a single tech salary. 3-5 sentences.",
  "lifestyle_economics": "Evaluate hidden and recurring costs: childcare, transportation, food, entertainment, insurance premiums, and seasonal factors that affect monthly budgets. 3-5 sentences.",
  "commute_and_infrastructure": "Assess transportation options, average commute costs, whether public transit is viable, and how remote/hybrid work adoption affects location value. 3-5 sentences.",
  "relocation_considerations": "Advise on the financial impact of relocating to or from this city: moving costs, geographic pay adjustment patterns, and whether employers offer relocation packages. 3-5 sentences."
}

IF ENTITY_TYPE == "Job":
{
  "career_leverage": "Explain the typical career ladder: IC vs management fork, level progression, how seniority multiplies compensation, and where the biggest jumps occur. 3-5 sentences.",
  "skill_premium": "Identify specific skills, tools, certifications, or specializations that historically push compensation to the top quartile for this role. 3-5 sentences.",
  "total_comp_anatomy": "Break down how total compensation is typically structured for this role: base salary weight, bonus expectations, equity prevalence, and how the mix shifts with seniority. 3-5 sentences.",
  "negotiation_tips": "Provide role-specific negotiation strategies: what to anchor on, which comp components are most flexible, how to leverage competing offers, and common employer tactics. 3-5 sentences.",
  "remote_viability": "Analyze remote work availability: whether this role is historically remote-friendly, how location-based pay adjustments work, and whether remote workers face a comp penalty. 3-5 sentences.",
  "adjacent_roles": "Map the role ecosystem: which related titles pay more or less, what lateral moves increase earning potential, and how this role feeds into higher-paying career paths. 3-5 sentences.",
  "demand_resilience": "Assess the structural demand for this role: automation exposure, outsourcing risk, whether demand is tied to cyclical or secular trends, and supply-side constraints. 3-5 sentences."
}`;

// ── Required keys per entity type (for validation) ──────────────────────────

const REQUIRED_KEYS: Record<EntityType, string[]> = {
  Company: ['comp_philosophy', 'equity_structure', 'benefit_sentiment', 'hiring_bar', 'negotiation_leverage', 'career_trajectory', 'work_culture_impact'],
  City: ['buying_power', 'tax_landscape', 'market_drivers', 'housing_affordability', 'lifestyle_economics', 'commute_and_infrastructure', 'relocation_considerations'],
  Job: ['career_leverage', 'skill_premium', 'total_comp_anatomy', 'negotiation_tips', 'remote_viability', 'adjacent_roles', 'demand_resilience'],
};

// ── Fallback content when API fails ─────────────────────────────────────────

function getFallbackContent(entityType: EntityType, entityName: string): SEOContentResponse {
  switch (entityType) {
    case 'Company':
      return {
        comp_philosophy: `Compensation at ${entityName} typically reflects its position within the competitive landscape, balancing base salary stability with variable components like equity and bonuses. The ratio of guaranteed-to-variable compensation tends to signal how the employer values retention versus performance incentives. Understanding where this employer falls on that spectrum is critical for evaluating the risk-adjusted value of an offer.`,
        equity_structure: `Equity compensation at employers in this tier generally follows either RSU or stock option models, each with distinct risk profiles and liquidity timelines. Vesting schedules typically span four years, though the shape — front-loaded, linear, or back-loaded — significantly impacts year-over-year realized earnings. Prospective employees should evaluate not just the grant value but the vesting cliff, refresh policies, and historical price trajectory to assess true equity value.`,
        benefit_sentiment: `Non-monetary benefits at ${entityName} historically include healthcare coverage, retirement matching, and professional development allocations that together form a meaningful portion of total compensation. The quality and generosity of these benefits often correlate with the employer's market positioning for talent and its willingness to invest in retention over raw salary. Evaluating the total benefit package alongside cash compensation provides a more accurate picture of overall value.`,
        hiring_bar: `The interview process at ${entityName} typically involves multiple rounds assessing both technical proficiency and behavioral alignment with organizational values. The rigor of the hiring bar generally reflects the employer's competitive position in the talent market and the scarcity of the skills they seek. Candidates who research the specific competencies and cultural signals valued by this organization gain a measurable advantage in both the evaluation and subsequent negotiation.`,
        negotiation_leverage: `Negotiation outcomes at this tier of employer tend to vary based on role seniority, the candidate's competitive positioning, and the urgency of the hiring need. Base salary, signing bonuses, and equity grants each have different flexibility ranges depending on internal band constraints and the candidate pipeline depth. Candidates with active competing offers from peer-tier employers historically achieve the strongest negotiation outcomes across all compensation components.`,
        career_trajectory: `Internal career progression at ${entityName} typically follows a structured leveling system where promotion velocity depends on demonstrated impact and scope expansion. The transparency of leveling frameworks, the cadence of promotion cycles, and the availability of lateral moves vary across teams and functions. Understanding typical tenure-to-promotion timelines and the factors that accelerate advancement helps candidates set realistic expectations for long-term earning growth.`,
        work_culture_impact: `The pace and work expectations at ${entityName} directly affect the effective hourly rate when normalizing total compensation against actual hours worked. High-intensity environments may offer higher nominal compensation but deliver lower per-hour value when factoring in on-call duties, after-hours expectations, and sustained sprint cycles. Evaluating work-life balance as a compensation variable provides a more honest assessment of an offer's true economic value over time.`,
      };
    case 'City':
      return {
        buying_power: `Take-home pay in ${entityName} is fundamentally shaped by the intersection of nominal salary levels and the cumulative local tax burden. The effective tax rate, including state and local components, determines what fraction of a gross salary translates to actual spending power. Professionals evaluating offers in this market should calculate net income rather than comparing gross figures across geographies, as the delta can meaningfully alter the value proposition of relocating.`,
        tax_landscape: `The state and local tax structure around ${entityName} creates a specific fiscal environment that directly impacts disposable income for high-earning professionals. Property taxes, sales taxes, and any municipal levies compound to create an effective total tax burden that diverges meaningfully from other major tech markets. Understanding the full tax picture — not just income tax — is essential for accurate cost-of-living comparisons and long-term financial planning.`,
        market_drivers: `The salary floor and ceiling in ${entityName} are historically anchored by the dominant industries and major employers in the metropolitan area. The concentration or diversity of employers creating demand for tech talent produces supply-demand dynamics that directly influence baseline compensation levels. Markets dominated by a single sector tend to offer less negotiation leverage than metros with diverse employer bases competing for the same talent pool.`,
        housing_affordability: `Housing costs in ${entityName} represent the single largest variable in a tech professional's monthly budget and frequently determine whether a nominally higher salary actually improves financial well-being. The ratio of median rent or mortgage payments to median tech salaries reveals whether housing is a manageable expense or a significant financial constraint. Prospective residents should evaluate both rental and ownership economics relative to their compensation level before making relocation decisions.`,
        lifestyle_economics: `Beyond housing, the cost structure of daily life in ${entityName} includes transportation, childcare, groceries, healthcare premiums, and seasonal utility costs that together constitute a significant portion of monthly expenses. These recurring costs vary meaningfully across neighborhoods and lifestyle choices within the metro area and often create surprises for professionals relocating from different markets. Budgeting accurately for these expenses prevents overestimating the financial benefit of a nominally higher salary.`,
        commute_and_infrastructure: `Transportation costs and commute duration in ${entityName} directly affect both monthly expenses and effective compensation when measured against time invested. The viability of public transit, the cost of vehicle ownership, parking, and tolls all factor into the true cost of maintaining employment in this market. As remote and hybrid work arrangements reshape commute expectations, the value proposition of proximity to office hubs continues to evolve.`,
        relocation_considerations: `Relocating to ${entityName} involves one-time costs and ongoing financial adjustments that should be explicitly modeled before accepting an offer in this market. Many employers offer relocation packages, though the generosity varies widely based on role seniority, hiring urgency, and the employer's standard policy. Geographic pay adjustments may apply when moving from higher or lower cost-of-living markets, and understanding the employer's stance on these adjustments is a critical part of the negotiation.`,
      };
    case 'Job':
      return {
        career_leverage: `Career progression for this role typically follows a dual-track model where professionals choose between deepening individual contributor expertise or transitioning into people management. Each track offers distinct compensation scaling patterns, with the largest jumps typically occurring at senior-to-staff transitions on the IC track or at the director level on the management track. Understanding the leveling system and promotion criteria at target employers provides strategic leverage for maximizing long-term compensation growth and career optionality.`,
        skill_premium: `Specific technical skills and domain certifications historically command a measurable premium for this role, with the size of the premium varying based on market scarcity and employer demand intensity. The premium tends to be largest for competencies that are both high-demand and low-supply within the talent market, creating pricing power for professionals who invest strategically. Identifying which specializations are trending toward commodity versus premium status helps professionals allocate their development time for maximum return.`,
        total_comp_anatomy: `Total compensation for this role typically comprises base salary, performance bonuses, and equity grants, though the weight of each component shifts significantly across employer tiers and seniority levels. At entry and mid-levels, base salary dominates the total package, while equity grants become an increasingly large proportion at senior levels and above, introducing more variance and upside potential. Understanding this structural shift is critical for accurately comparing offers across different levels, companies, and compensation philosophies.`,
        negotiation_tips: `Negotiation strategy for this role should be calibrated to the specific components that offer the most flexibility at the target employer. Base salary bands are often constrained by internal equity considerations, frequently making signing bonuses and equity grants more negotiable than base pay adjustments. Candidates with competing offers, scarce specializations, or timing advantages (e.g., the employer is backfilling a critical position) historically achieve the strongest outcomes by anchoring negotiations on total compensation rather than individual components.`,
        remote_viability: `Remote work availability for this role varies meaningfully across employers and carries structural implications for both compensation levels and career progression. Some organizations apply geographic pay adjustments that reduce compensation for remote workers located outside of target metro areas, while others maintain location-agnostic pay bands. The long-term career impact of remote arrangements — including visibility for promotions and access to high-impact projects — should be weighed alongside the immediate financial calculus.`,
        adjacent_roles: `The ecosystem of related roles provides strategic context for career planning and compensation optimization beyond vertical promotion. Lateral moves to adjacent titles that command higher pay bands or offer faster progression paths represent an underutilized strategy for accelerating earnings growth. Mapping the transferability of skills between this role and higher-paying adjacent positions — and understanding which transitions employers view favorably — creates optionality that pure vertical advancement does not.`,
        demand_resilience: `Structural demand for this role is shaped by factors that operate independently of short-term economic cycles, including the pace of digital transformation, regulatory requirements, and the complexity of the systems this role supports. The degree of automation exposure, outsourcing feasibility, and dependency on secular growth trends together determine how resilient compensation levels and job availability are likely to remain. Professionals in roles with high structural demand, limited talent supply, and low automation exposure tend to maintain stronger negotiating positions and more stable career trajectories.`,
      };
  }
}

// ── Core generator function ─────────────────────────────────────────────────

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
        maxOutputTokens: 4096,
        responseMimeType: 'application/json',
      },
      systemInstruction: SYSTEM_PROMPT,
    });

    const userPrompt = [
      `Entity Type: ${entityType}`,
      `Entity Name: ${entityName}`,
      `Context: ${contextData}`,
      ``,
      `Write 7 substantive sections (3-5 sentences each) plus at least one dynamic key unique to "${entityName}".`,
      `Every sentence must deliver a distinct analytical insight. No filler. No generic phrasing that could apply to any other ${entityType.toLowerCase()}.`,
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
