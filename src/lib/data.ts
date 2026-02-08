// Mock market data for demo purposes
// In production, this would query a database (e.g., Supabase)
// and return company-specific salary information.

interface MarketData {
  median: number;
  blsMedian: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
}

/**
 * MARKET_DATA:
 * A nested object structure for mock salary data.
 * Key hierarchy: Company -> Role -> Location -> Level -> MarketData
 *
 * TODO: Replace this with a database query or external API call.
 *       Ensure data is regularly updated and sourced from reliable providers.
 */
const MARKET_DATA: Record<string, Record<string, Record<string, Record<string, MarketData>>>> = {
  // Google
  "Google": {
    "Software Engineer": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 180000, blsMedian: 135000, p10: 150000, p25: 165000, p75: 200000, p90: 230000 },
        "Mid (L3-L4)": { median: 280000, blsMedian: 180000, p10: 220000, p25: 250000, p75: 320000, p90: 380000 },
        "Senior (L5-L6)": { median: 400000, blsMedian: 260000, p10: 350000, p25: 380000, p75: 480000, p90: 580000 },
        "Staff+ (L7+)": { median: 600000, blsMedian: 380000, p10: 500000, p25: 550000, p75: 700000, p90: 850000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 170000, blsMedian: 128000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
        "Mid (L3-L4)": { median: 260000, blsMedian: 170000, p10: 210000, p25: 235000, p75: 300000, p90: 350000 },
        "Senior (L5-L6)": { median: 380000, blsMedian: 240000, p10: 330000, p25: 360000, p75: 450000, p90: 550000 },
        "Staff+ (L7+)": { median: 560000, blsMedian: 360000, p10: 480000, p25: 520000, p75: 650000, p90: 800000 },
      },
      "Seattle, WA": {
        "Junior (L1-L2)": { median: 175000, blsMedian: 132000, p10: 145000, p25: 160000, p75: 195000, p90: 225000 },
        "Mid (L3-L4)": { median: 270000, blsMedian: 175000, p10: 215000, p25: 245000, p75: 310000, p90: 365000 },
        "Senior (L5-L6)": { median: 390000, blsMedian: 250000, p10: 340000, p25: 365000, p75: 460000, p90: 560000 },
        "Staff+ (L7+)": { median: 580000, blsMedian: 370000, p10: 490000, p25: 535000, p75: 675000, p90: 825000 },
      },
    },
    "Product Manager": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 160000, blsMedian: 125000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
        "Mid (L3-L4)": { median: 250000, blsMedian: 170000, p10: 200000, p25: 225000, p75: 285000, p90: 340000 },
        "Senior (L5-L6)": { median: 350000, blsMedian: 245000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
        "Staff+ (L7+)": { median: 500000, blsMedian: 350000, p10: 420000, p25: 460000, p75: 580000, p90: 700000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 150000, blsMedian: 118000, p10: 120000, p25: 135000, p75: 170000, p90: 200000 },
        "Mid (L3-L4)": { median: 230000, blsMedian: 160000, p10: 185000, p25: 210000, p75: 265000, p90: 320000 },
        "Senior (L5-L6)": { median: 330000, blsMedian: 225000, p10: 280000, p25: 305000, p75: 380000, p90: 470000 },
        "Staff+ (L7+)": { median: 470000, blsMedian: 330000, p10: 400000, p25: 435000, p75: 550000, p90: 660000 },
      },
    },
  },
  // Meta
  "Meta": {
    "Software Engineer": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 175000, blsMedian: 135000, p10: 145000, p25: 160000, p75: 195000, p90: 225000 },
        "Mid (L3-L4)": { median: 275000, blsMedian: 180000, p10: 215000, p25: 245000, p75: 315000, p90: 375000 },
        "Senior (L5-L6)": { median: 390000, blsMedian: 260000, p10: 340000, p25: 365000, p75: 465000, p90: 565000 },
        "Staff+ (L7+)": { median: 580000, blsMedian: 380000, p10: 490000, p25: 535000, p75: 675000, p90: 825000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 165000, blsMedian: 128000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
        "Mid (L3-L4)": { median: 255000, blsMedian: 170000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
        "Senior (L5-L6)": { median: 370000, blsMedian: 240000, p10: 320000, p25: 345000, p75: 440000, p90: 540000 },
        "Staff+ (L7+)": { median: 550000, blsMedian: 360000, p10: 470000, p25: 510000, p75: 640000, p90: 790000 },
      },
      "Seattle, WA": {
        "Junior (L1-L2)": { median: 170000, blsMedian: 132000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
        "Mid (L3-L4)": { median: 265000, blsMedian: 175000, p10: 210000, p25: 240000, p75: 305000, p90: 360000 },
        "Senior (L5-L6)": { median: 380000, blsMedian: 250000, p10: 330000, p25: 355000, p75: 450000, p90: 550000 },
        "Staff+ (L7+)": { median: 565000, blsMedian: 370000, p10: 480000, p25: 522000, p75: 658000, p90: 808000 },
      },
    },
    "Product Manager": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 155000, blsMedian: 125000, p10: 125000, p25: 140000, p75: 175000, p90: 205000 },
        "Mid (L3-L4)": { median: 245000, blsMedian: 170000, p10: 195000, p25: 220000, p75: 280000, p90: 335000 },
        "Senior (L5-L6)": { median: 340000, blsMedian: 245000, p10: 290000, p25: 315000, p75: 390000, p90: 490000 },
        "Staff+ (L7+)": { median: 490000, blsMedian: 350000, p10: 410000, p25: 450000, p75: 570000, p90: 690000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 145000, blsMedian: 118000, p10: 115000, p25: 130000, p75: 165000, p90: 195000 },
        "Mid (L3-L4)": { median: 225000, blsMedian: 160000, p10: 180000, p25: 205000, p75: 260000, p90: 315000 },
        "Senior (L5-L6)": { median: 320000, blsMedian: 225000, p10: 270000, p25: 295000, p75: 370000, p90: 460000 },
        "Staff+ (L7+)": { median: 460000, blsMedian: 330000, p10: 390000, p25: 425000, p75: 540000, p90: 650000 },
      },
    },
  },
  // Amazon
  "Amazon": {
    "Software Engineer": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 160000, blsMedian: 135000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
        "Mid (L3-L4)": { median: 250000, blsMedian: 180000, p10: 200000, p25: 225000, p75: 290000, p90: 340000 },
        "Senior (L5-L6)": { median: 350000, blsMedian: 260000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
        "Staff+ (L7+)": { median: 520000, blsMedian: 380000, p10: 440000, p25: 480000, p75: 600000, p90: 740000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 155000, blsMedian: 128000, p10: 125000, p25: 140000, p75: 175000, p90: 205000 },
        "Mid (L3-L4)": { median: 240000, blsMedian: 170000, p10: 190000, p25: 215000, p75: 275000, p90: 325000 },
        "Senior (L5-L6)": { median: 340000, blsMedian: 240000, p10: 290000, p25: 315000, p75: 390000, p90: 490000 },
        "Staff+ (L7+)": { median: 500000, blsMedian: 360000, p10: 420000, p25: 460000, p75: 580000, p90: 700000 },
      },
      "Seattle, WA": {
        "Junior (L1-L2)": { median: 165000, blsMedian: 132000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
        "Mid (L3-L4)": { median: 255000, blsMedian: 175000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
        "Senior (L5-L6)": { median: 360000, blsMedian: 250000, p10: 310000, p25: 335000, p75: 415000, p90: 515000 },
        "Staff+ (L7+)": { median: 540000, blsMedian: 370000, p10: 460000, p25: 500000, p75: 630000, p90: 770000 },
      },
    },
    "Product Manager": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 140000, blsMedian: 125000, p10: 110000, p25: 125000, p75: 160000, p90: 190000 },
        "Mid (L3-L4)": { median: 220000, blsMedian: 170000, p10: 175000, p25: 200000, p75: 255000, p90: 305000 },
        "Senior (L5-L6)": { median: 310000, blsMedian: 245000, p10: 260000, p25: 285000, p75: 360000, p90: 450000 },
        "Staff+ (L7+)": { median: 450000, blsMedian: 350000, p10: 380000, p25: 415000, p75: 530000, p90: 640000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 130000, blsMedian: 118000, p10: 100000, p25: 115000, p75: 150000, p90: 180000 },
        "Mid (L3-L4)": { median: 200000, blsMedian: 160000, p10: 160000, p25: 180000, p75: 235000, p90: 280000 },
        "Senior (L5-L6)": { median: 290000, blsMedian: 225000, p10: 240000, p25: 265000, p75: 340000, p90: 420000 },
        "Staff+ (L7+)": { median: 420000, blsMedian: 330000, p10: 355000, p25: 390000, p75: 495000, p90: 600000 },
      },
    },
  },
  // Apple
  "Apple": {
    "Software Engineer": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 170000, blsMedian: 135000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
        "Mid (L3-L4)": { median: 260000, blsMedian: 180000, p10: 210000, p25: 235000, p75: 300000, p90: 350000 },
        "Senior (L5-L6)": { median: 370000, blsMedian: 260000, p10: 320000, p25: 345000, p75: 430000, p90: 530000 },
        "Staff+ (L7+)": { median: 550000, blsMedian: 380000, p10: 470000, p25: 510000, p75: 640000, p90: 790000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 160000, blsMedian: 128000, p10: 130000, p25: 145000, p75: 180000, p90: 210000 },
        "Mid (L3-L4)": { median: 250000, blsMedian: 170000, p10: 200000, p25: 225000, p75: 290000, p90: 340000 },
        "Senior (L5-L6)": { median: 350000, blsMedian: 240000, p10: 300000, p25: 325000, p75: 400000, p90: 500000 },
        "Staff+ (L7+)": { median: 530000, blsMedian: 360000, p10: 450000, p25: 490000, p75: 620000, p90: 760000 },
      },
      "Seattle, WA": {
        "Junior (L1-L2)": { median: 165000, blsMedian: 132000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
        "Mid (L3-L4)": { median: 255000, blsMedian: 175000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
        "Senior (L5-L6)": { median: 360000, blsMedian: 250000, p10: 310000, p25: 335000, p75: 415000, p90: 515000 },
        "Staff+ (L7+)": { median: 540000, blsMedian: 370000, p10: 460000, p25: 500000, p75: 630000, p90: 770000 },
      },
    },
    "Product Manager": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 150000, blsMedian: 125000, p10: 120000, p25: 135000, p75: 170000, p90: 200000 },
        "Mid (L3-L4)": { median: 230000, blsMedian: 170000, p10: 185000, p25: 210000, p75: 265000, p90: 320000 },
        "Senior (L5-L6)": { median: 320000, blsMedian: 245000, p10: 270000, p25: 295000, p75: 370000, p90: 460000 },
        "Staff+ (L7+)": { median: 470000, blsMedian: 350000, p10: 395000, p25: 435000, p75: 550000, p90: 660000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 140000, blsMedian: 118000, p10: 110000, p25: 125000, p75: 160000, p90: 190000 },
        "Mid (L3-L4)": { median: 210000, blsMedian: 160000, p10: 170000, p25: 190000, p75: 245000, p90: 295000 },
        "Senior (L5-L6)": { median: 300000, blsMedian: 225000, p10: 250000, p25: 275000, p75: 350000, p90: 435000 },
        "Staff+ (L7+)": { median: 440000, blsMedian: 330000, p10: 375000, p25: 410000, p75: 520000, p90: 625000 },
      },
    },
  },
  // Microsoft
  "Microsoft": {
    "Software Engineer": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 165000, blsMedian: 135000, p10: 135000, p25: 150000, p75: 185000, p90: 215000 },
        "Mid (L3-L4)": { median: 255000, blsMedian: 180000, p10: 205000, p25: 230000, p75: 295000, p90: 345000 },
        "Senior (L5-L6)": { median: 360000, blsMedian: 260000, p10: 310000, p25: 335000, p75: 415000, p90: 515000 },
        "Staff+ (L7+)": { median: 530000, blsMedian: 380000, p10: 450000, p25: 490000, p75: 620000, p90: 760000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 155000, blsMedian: 128000, p10: 125000, p25: 140000, p75: 175000, p90: 205000 },
        "Mid (L3-L4)": { median: 240000, blsMedian: 170000, p10: 190000, p25: 215000, p75: 275000, p90: 325000 },
        "Senior (L5-L6)": { median: 340000, blsMedian: 240000, p10: 290000, p25: 315000, p75: 390000, p90: 490000 },
        "Staff+ (L7+)": { median: 510000, blsMedian: 360000, p10: 435000, p25: 475000, p75: 600000, p90: 735000 },
      },
      "Seattle, WA": {
        "Junior (L1-L2)": { median: 170000, blsMedian: 132000, p10: 140000, p25: 155000, p75: 190000, p90: 220000 },
        "Mid (L3-L4)": { median: 260000, blsMedian: 175000, p10: 210000, p25: 235000, p75: 300000, p90: 350000 },
        "Senior (L5-L6)": { median: 370000, blsMedian: 250000, p10: 320000, p25: 345000, p75: 430000, p90: 530000 },
        "Staff+ (L7+)": { median: 550000, blsMedian: 370000, p10: 470000, p25: 510000, p75: 640000, p90: 790000 },
      },
    },
    "Product Manager": {
      "San Francisco, CA": {
        "Junior (L1-L2)": { median: 145000, blsMedian: 125000, p10: 115000, p25: 130000, p75: 165000, p90: 195000 },
        "Mid (L3-L4)": { median: 225000, blsMedian: 170000, p10: 180000, p25: 205000, p75: 260000, p90: 315000 },
        "Senior (L5-L6)": { median: 315000, blsMedian: 245000, p10: 265000, p25: 290000, p75: 365000, p90: 455000 },
        "Staff+ (L7+)": { median: 460000, blsMedian: 350000, p10: 390000, p25: 425000, p75: 540000, p90: 650000 },
      },
      "New York, NY": {
        "Junior (L1-L2)": { median: 135000, blsMedian: 118000, p10: 105000, p25: 120000, p75: 155000, p90: 185000 },
        "Mid (L3-L4)": { median: 205000, blsMedian: 160000, p10: 165000, p25: 185000, p75: 240000, p90: 290000 },
        "Senior (L5-L6)": { median: 295000, blsMedian: 225000, p10: 245000, p25: 270000, p75: 345000, p90: 430000 },
        "Staff+ (L7+)": { median: 430000, blsMedian: 330000, p10: 365000, p25: 400000, p75: 505000, p90: 610000 },
      },
    },
  },
};

const DEFAULT_DATA: MarketData = { 
  median: 150000, 
  blsMedian: 145000, 
  p10: 110000, 
  p25: 130000, 
  p75: 180000, 
  p90: 220000 
};

/**
 * getMarketData:
 * Retrieves salary market data for a specific company, role, location, and experience level.
 * Falls back to DEFAULT_DATA if the specific combination is not found.
 *
 * @param company - The company name (e.g., "Google").
 * @param role - The job role (e.g., "Software Engineer").
 * @param location - The location (e.g., "San Francisco, CA").
 * @param level - The experience level (e.g., "Mid (L3-L4)").
 * @returns MarketData object containing salary percentiles and medians.
 */
export function getMarketData(company: string, role: string, location: string, level: string): MarketData {
  return MARKET_DATA[company]?.[role]?.[location]?.[level] ?? DEFAULT_DATA;
}

/**
 * calculateGrade:
 * Calculates a letter grade based on the user's total compensation relative to the market median.
 *
 * @param yourTotal - The user's total compensation.
 * @param marketMedian - The market median compensation.
 * @returns A letter grade (A, B, C, D, F).
 */
export function calculateGrade(yourTotal: number, marketMedian: number): string {
  const ratio = yourTotal / marketMedian;
  if (ratio >= 1.2) return "A";
  if (ratio >= 1.0) return "B";
  if (ratio >= 0.85) return "C";
  if (ratio >= 0.7) return "D";
  return "F";
}

// Export constants derived from the MARKET_DATA for dynamic generation of options/paths.
export const COMPANIES = Object.keys(MARKET_DATA);
export const ROLES = Array.from(new Set(Object.values(MARKET_DATA).flatMap(company => Object.keys(company))));
export const LOCATIONS = Array.from(new Set(Object.values(MARKET_DATA).flatMap(company => Object.values(company).flatMap(role => Object.keys(role)))));
export const LEVELS = [
  { value: "Junior (L1-L2)", label: "Junior (L1-L2)" },
  { value: "Mid (L3-L4)", label: "Mid (L3-L4)" },
  { value: "Senior (L5-L6)", label: "Senior (L5-L6)" },
  { value: "Staff+ (L7+)", label: "Staff+ (L7+)" },
];
