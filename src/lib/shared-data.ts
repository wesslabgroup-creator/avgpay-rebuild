export interface MarketData {
    median: number;
    blsMedian: number;
    min: number;
    max: number;
    p10: number;
    p25: number;
    p75: number;
    p90: number;
}

/**
 * MARKET_DATA:
 * A nested object structure for mock salary data, kept as fallback and for generating static paths.
 */
export const MARKET_DATA: Record<string, Record<string, Record<string, Record<string, MarketData>>>> = {
    // Google
    "Google": {
        "Software Engineer": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 180000, blsMedian: 135000, min: 120000, max: 240000, p10: 150000, p25: 165000, p75: 200000, p90: 230000 },
                "Mid (L3-L4)": { median: 280000, blsMedian: 180000, min: 280000 - 50000, max: 280000 + 100000, p10: 220000, p25: 250000, p75: 320000, p90: 380000 },
                "Senior (L5-L6)": { median: 400000, blsMedian: 260000, min: 400000 - 50000, max: 400000 + 100000, p10: 350000, p25: 380000, p75: 480000, p90: 580000 },
                "Staff+ (L7+)": { median: 600000, blsMedian: 380000, min: 600000 - 50000, max: 600000 + 100000, p10: 500000, p25: 550000, p75: 700000, p90: 850000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 170000, blsMedian: 128000, min: 170000 - 50000, max: 170000 + 100000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
                "Mid (L3-L4)": { median: 260000, blsMedian: 170000, min: 260000 - 50000, max: 260000 + 100000, p10: 210000, p25: 235000, p75: 300000, p90: 350000 },
                "Senior (L5-L6)": { median: 380000, blsMedian: 240000, min: 380000 - 50000, max: 380000 + 100000, p10: 330000, p25: 360000, p75: 450000, p90: 550000 },
                "Staff+ (L7+)": { median: 560000, blsMedian: 360000, min: 560000 - 50000, max: 560000 + 100000, p10: 480000, p25: 520000, p75: 650000, p90: 800000 },
            },
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 175000, blsMedian: 132000, min: 175000 - 50000, max: 175000 + 100000, p10: 145000, p25: 160000, p75: 195000, p90: 225000 },
                "Mid (L3-L4)": { median: 270000, blsMedian: 175000, min: 270000 - 50000, max: 270000 + 100000, p10: 215000, p25: 245000, p75: 310000, p90: 365000 },
                "Senior (L5-L6)": { median: 390000, blsMedian: 250000, min: 390000 - 50000, max: 390000 + 100000, p10: 340000, p25: 365000, p75: 460000, p90: 560000 },
                "Staff+ (L7+)": { median: 580000, blsMedian: 370000, min: 580000 - 50000, max: 580000 + 100000, p10: 490000, p25: 535000, p75: 675000, p90: 825000 },
            },
        },
        "Product Manager": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 160000, blsMedian: 125000, min: 160000 - 50000, max: 160000 + 100000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
                "Mid (L3-L4)": { median: 250000, blsMedian: 170000, min: 250000 - 50000, max: 250000 + 100000, p10: 200000, p25: 225000, p75: 285000, p90: 340000 },
                "Senior (L5-L6)": { median: 350000, blsMedian: 245000, min: 350000 - 50000, max: 350000 + 100000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
                "Staff+ (L7+)": { median: 500000, blsMedian: 350000, min: 500000 - 50000, max: 500000 + 100000, p10: 420000, p25: 460000, p75: 580000, p90: 700000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 150000, blsMedian: 118000, min: 150000 - 50000, max: 150000 + 100000, p10: 120000, p25: 135000, p75: 170000, p90: 200000 },
                "Mid (L3-L4)": { median: 230000, blsMedian: 160000, min: 230000 - 50000, max: 230000 + 100000, p10: 185000, p25: 210000, p75: 265000, p90: 320000 },
                "Senior (L5-L6)": { median: 330000, blsMedian: 225000, min: 330000 - 50000, max: 330000 + 100000, p10: 280000, p25: 305000, p75: 380000, p90: 470000 },
                "Staff+ (L7+)": { median: 470000, blsMedian: 330000, min: 470000 - 50000, max: 470000 + 100000, p10: 400000, p25: 435000, p75: 550000, p90: 660000 },
            },
        },
    },
    // Meta
    "Meta": {
        "Software Engineer": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 175000, blsMedian: 135000, min: 175000 - 50000, max: 175000 + 100000, p10: 145000, p25: 160000, p75: 195000, p90: 225000 },
                "Mid (L3-L4)": { median: 275000, blsMedian: 180000, min: 275000 - 50000, max: 275000 + 100000, p10: 215000, p25: 245000, p75: 315000, p90: 375000 },
                "Senior (L5-L6)": { median: 390000, blsMedian: 260000, min: 390000 - 50000, max: 390000 + 100000, p10: 340000, p25: 365000, p75: 465000, p90: 565000 },
                "Staff+ (L7+)": { median: 580000, blsMedian: 380000, min: 580000 - 50000, max: 580000 + 100000, p10: 490000, p25: 535000, p75: 675000, p90: 825000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 165000, blsMedian: 128000, min: 165000 - 50000, max: 165000 + 100000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
                "Mid (L3-L4)": { median: 255000, blsMedian: 170000, min: 255000 - 50000, max: 255000 + 100000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
                "Senior (L5-L6)": { median: 370000, blsMedian: 240000, min: 370000 - 50000, max: 370000 + 100000, p10: 320000, p25: 345000, p75: 440000, p90: 540000 },
                "Staff+ (L7+)": { median: 550000, blsMedian: 360000, min: 550000 - 50000, max: 550000 + 100000, p10: 470000, p25: 510000, p75: 640000, p90: 790000 },
            },
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 170000, blsMedian: 132000, min: 170000 - 50000, max: 170000 + 100000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
                "Mid (L3-L4)": { median: 265000, blsMedian: 175000, min: 265000 - 50000, max: 265000 + 100000, p10: 210000, p25: 240000, p75: 305000, p90: 360000 },
                "Senior (L5-L6)": { median: 380000, blsMedian: 250000, min: 380000 - 50000, max: 380000 + 100000, p10: 330000, p25: 355000, p75: 450000, p90: 550000 },
                "Staff+ (L7+)": { median: 565000, blsMedian: 370000, min: 565000 - 50000, max: 565000 + 100000, p10: 480000, p25: 522000, p75: 658000, p90: 808000 },
            },
        },
        "Product Manager": {
            "San Francisco, CA": {
                "Junior (L1-L2)": { median: 155000, blsMedian: 125000, min: 155000 - 50000, max: 155000 + 100000, p10: 125000, p25: 140000, p75: 175000, p90: 205000 },
                "Mid (L3-L4)": { median: 245000, blsMedian: 170000, min: 245000 - 50000, max: 245000 + 100000, p10: 195000, p25: 220000, p75: 280000, p90: 335000 },
                "Senior (L5-L6)": { median: 340000, blsMedian: 245000, min: 340000 - 50000, max: 340000 + 100000, p10: 290000, p25: 315000, p75: 390000, p90: 490000 },
                "Staff+ (L7+)": { median: 490000, blsMedian: 350000, min: 490000 - 50000, max: 490000 + 100000, p10: 410000, p25: 450000, p75: 570000, p90: 690000 },
            },
            "New York, NY": {
                "Junior (L1-L2)": { median: 145000, blsMedian: 118000, min: 145000 - 50000, max: 145000 + 100000, p10: 115000, p25: 130000, p75: 165000, p90: 195000 },
                "Mid (L3-L4)": { median: 225000, blsMedian: 160000, min: 225000 - 50000, max: 225000 + 100000, p10: 180000, p25: 205000, p75: 260000, p90: 315000 },
                "Senior (L5-L6)": { median: 320000, blsMedian: 225000, min: 320000 - 50000, max: 320000 + 100000, p10: 270000, p25: 295000, p75: 370000, p90: 460000 },
                "Staff+ (L7+)": { median: 460000, blsMedian: 330000, min: 460000 - 50000, max: 460000 + 100000, p10: 390000, p25: 425000, p75: 540000, p90: 650000 },
            },
        },
    },
    // Amazon
    "Amazon": {
        "Software Engineer": {
            "Seattle, WA": {
                "Junior (L1-L2)": { median: 160000, blsMedian: 132000, min: 160000 - 50000, max: 160000 + 100000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
                "Mid (L3-L4)": { median: 245000, blsMedian: 175000, min: 245000 - 50000, max: 245000 + 100000, p10: 200000, p25: 225000, p75: 280000, p90: 330000 },
                "Senior (L5-L6)": { median: 350000, blsMedian: 250000, min: 350000 - 50000, max: 350000 + 100000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
                "Staff+ (L7+)": { median: 500000, blsMedian: 370000, min: 500000 - 50000, max: 500000 + 100000, p10: 430000, p25: 470000, p75: 590000, p90: 720000 },
            },
        },
    },
    // Apple
    "Apple": {
        "Software Engineer": {
            "Cupertino, CA": {
                "Junior (L1-L2)": { median: 170000, blsMedian: 135000, min: 170000 - 50000, max: 170000 + 100000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
                "Mid (L3-L4)": { median: 270000, blsMedian: 180000, min: 270000 - 50000, max: 270000 + 100000, p10: 210000, p25: 240000, p75: 310000, p90: 370000 },
                "Senior (L5-L6)": { median: 380000, blsMedian: 260000, min: 380000 - 50000, max: 380000 + 100000, p10: 330000, p25: 355000, p75: 450000, p90: 550000 },
                "Staff+ (L7+)": { median: 570000, blsMedian: 380000, min: 570000 - 50000, max: 570000 + 100000, p10: 480000, p25: 520000, p75: 660000, p90: 810000 },
            },
        },
    },
    // Microsoft
    "Microsoft": {
        "Software Engineer": {
            "Redmond, WA": {
                "Junior (L1-L2)": { median: 165000, blsMedian: 132000, min: 165000 - 50000, max: 165000 + 100000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
                "Mid (L3-L4)": { median: 250000, blsMedian: 175000, min: 250000 - 50000, max: 250000 + 100000, p10: 200000, p25: 225000, p75: 290000, p90: 340000 },
                "Senior (L5-L6)": { median: 360000, blsMedian: 250000, min: 360000 - 50000, max: 360000 + 100000, p10: 310000, p25: 335000, p75: 430000, p90: 530000 },
                "Staff+ (L7+)": { median: 540000, blsMedian: 370000, min: 540000 - 50000, max: 540000 + 100000, p10: 460000, p25: 500000, p75: 630000, p90: 780000 },
            },
        },
    },
};

export const DEFAULT_DATA: MarketData = {
    median: 150000,
    blsMedian: 145000,
    min: 100000,
    max: 250000,
    p10: 110000,
    p25: 130000,
    p75: 180000,
    p90: 220000
};

// Export constants derived from the MARKET_DATA for dynamic generation of options/paths.
// We keep these static for now to avoid async complexity in client components during Phase 1.
export const COMPANIES = Object.keys(MARKET_DATA);
export const ROLES = Array.from(new Set(Object.values(MARKET_DATA).flatMap(company => Object.keys(company))));
export const LOCATIONS = Array.from(new Set(Object.values(MARKET_DATA).flatMap(company => Object.values(company).flatMap(role => Object.keys(role)))));
export const LEVELS = [
    { value: "Junior (L1-L2)", label: "Junior (L1-L2)" },
    { value: "Mid (L3-L4)", label: "Mid (L3-L4)" },
    { value: "Senior (L5-L6)", label: "Senior (L5-L6)" },
    { value: "Staff+ (L7+)", label: "Staff+ (L7+)" },
];

/**
 * calculateGrade:
 * Calculates a letter grade based on the user's total compensation relative to the market median.
 */
export function calculateGrade(yourTotal: number, marketMedian: number): string {
    const ratio = yourTotal / marketMedian;
    if (ratio >= 1.2) return "A";
    if (ratio >= 1.0) return "B";
    if (ratio >= 0.85) return "C";
    if (ratio >= 0.7) return "D";
    return "F";
}
