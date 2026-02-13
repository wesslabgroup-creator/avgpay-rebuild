export type EntityType = 'Company' | 'City' | 'Job' | 'Combo' | 'Comparison';

export interface CompanyAnalysis {
    comp_philosophy: string;
    benefit_sentiment: string;
    hiring_bar: string;
    [key: string]: unknown;
}

export interface CityAnalysis {
    buying_power: string;
    market_drivers: string;
    lifestyle_economics: string;
    [key: string]: unknown;
}

export interface JobAnalysis {
    career_leverage: string;
    skill_premium: string;
    remote_viability: string;
    [key: string]: unknown;
}

export interface ComboAnalysis {
    local_market_leverage: string;
    disposable_income_index: string;
    commute_economics: string;
    [key: string]: unknown;
}

export interface ComparisonAnalysis {
    philosophical_divergence: string;
    cultural_tradeoff: string;
    winner_profile: string;
    [key: string]: unknown;
}

export type AnalysisResult = CompanyAnalysis | CityAnalysis | JobAnalysis | ComboAnalysis | ComparisonAnalysis;
