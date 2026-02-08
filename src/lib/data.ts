// Mock market data for demo purposes
// In production, this would query the database

interface MarketData {
  median: number;
  blsMedian: number;
  p10: number;
  p25: number;
  p75: number;
  p90: number;
}

const MARKET_DATA: Record<string, Record<string, Record<string, MarketData>>> = {
  "Software Engineer": {
    "San Francisco, CA": {
      "Junior (L1-L2)": { median: 140000, blsMedian: 135000, p10: 100000, p25: 120000, p75: 170000, p90: 200000 },
      "Mid (L3-L4)": { median: 190000, blsMedian: 180000, p10: 150000, p25: 165000, p75: 230000, p90: 280000 },
      "Senior (L5-L6)": { median: 280000, blsMedian: 260000, p10: 220000, p25: 250000, p75: 350000, p90: 450000 },
      "Staff+ (L7+)": { median: 420000, blsMedian: 380000, p10: 350000, p25: 380000, p75: 500000, p90: 650000 },
    },
    "New York, NY": {
      "Junior (L1-L2)": { median: 130000, blsMedian: 128000, p10: 95000, p25: 110000, p75: 155000, p90: 180000 },
      "Mid (L3-L4)": { median: 175000, blsMedian: 170000, p10: 140000, p25: 155000, p75: 210000, p90: 250000 },
      "Senior (L5-L6)": { median: 250000, blsMedian: 240000, p10: 200000, p25: 225000, p75: 300000, p90: 380000 },
      "Staff+ (L7+)": { median: 380000, blsMedian: 360000, p10: 320000, p25: 350000, p75: 450000, p90: 550000 },
    },
    "Seattle, WA": {
      "Junior (L1-L2)": { median: 135000, blsMedian: 132000, p10: 100000, p25: 118000, p75: 160000, p90: 190000 },
      "Mid (L3-L4)": { median: 180000, blsMedian: 175000, p10: 145000, p25: 160000, p75: 215000, p90: 260000 },
      "Senior (L5-L6)": { median: 260000, blsMedian: 250000, p10: 210000, p25: 235000, p75: 310000, p90: 400000 },
      "Staff+ (L7+)": { median: 400000, blsMedian: 370000, p10: 330000, p25: 365000, p75: 480000, p90: 600000 },
    },
  },
  "Product Manager": {
    "San Francisco, CA": {
      "Junior (L1-L2)": { median: 130000, blsMedian: 125000, p10: 95000, p25: 110000, p75: 155000, p90: 180000 },
      "Mid (L3-L4)": { median: 180000, blsMedian: 170000, p10: 145000, p25: 160000, p75: 210000, p90: 250000 },
      "Senior (L5-L6)": { median: 260000, blsMedian: 245000, p10: 210000, p25: 235000, p75: 300000, p90: 380000 },
      "Staff+ (L7+)": { median: 380000, blsMedian: 350000, p10: 320000, p25: 350000, p75: 450000, p90: 550000 },
    },
    "New York, NY": {
      "Junior (L1-L2)": { median: 120000, blsMedian: 118000, p10: 90000, p25: 105000, p75: 145000, p90: 170000 },
      "Mid (L3-L4)": { median: 165000, blsMedian: 160000, p10: 135000, p25: 148000, p75: 195000, p90: 230000 },
      "Senior (L5-L6)": { median: 235000, blsMedian: 225000, p10: 195000, p25: 215000, p75: 275000, p90: 340000 },
      "Staff+ (L7+)": { median: 350000, blsMedian: 330000, p10: 295000, p25: 320000, p75: 400000, p90: 500000 },
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

export function getMarketData(role: string, location: string, level: string): MarketData {
  return MARKET_DATA[role]?.[location]?.[level] ?? DEFAULT_DATA;
}

export function calculateGrade(yourTotal: number, marketMedian: number): string {
  const ratio = yourTotal / marketMedian;
  if (ratio >= 1.2) return "A";
  if (ratio >= 1.0) return "B";
  if (ratio >= 0.85) return "C";
  if (ratio >= 0.7) return "D";
  return "F";
}

export const ROLES = Object.keys(MARKET_DATA);
export const LOCATIONS = Array.from(new Set(Object.values(MARKET_DATA).flatMap(Object.keys)));
