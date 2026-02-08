export const COMPANIES = ['Google', 'Meta', 'Amazon', 'Microsoft', 'Apple', 'Stripe', 'Netflix', 'Uber', 'Airbnb', 'Stripe'];

export const ROLES = ['Software Engineer', 'Product Manager', 'Data Scientist', 'Sales', 'Designer'];

export const LOCATIONS = ['San Francisco', 'New York', 'Seattle', 'Austin', 'Boston', 'Remote'];

export const LEVELS = [
  { value: 'Junior', label: 'Junior (L1-L2)' },
  { value: 'Mid', label: 'Mid (L3-L4)' },
  { value: 'Senior', label: 'Senior (L5-L6)' },
  { value: 'Staff', label: 'Staff+ (L7+)' }
];

export const MARKET_DATA = {
  Google: {
    'Software Engineer': {
      'San Francisco': {
        'Junior (L1-L2)': { median: 220000, blsMedian: 180000 },
        'Mid (L3-L4)': { median: 350000, blsMedian: 280000 },
        'Senior (L5-L6)': { median: 500000, blsMedian: 400000 },
        'Staff+ (L7+)': { median: 750000, blsMedian: 600000 }
      },
      'New York': {
        'Junior (L1-L2)': { median: 200000, blsMedian: 170000 },
        'Mid (L3-L4)': { median: 320000, blsMedian: 260000 },
        'Senior (L5-L6)': { median: 450000, blsMedian: 370000 },
        'Staff+ (L7+)': { median: 680000, blsMedian: 550000 }
      }
    },
    'Product Manager': {
      'San Francisco': {
        'Junior (L1-L2)': { median: 180000, blsMedian: 150000 },
        'Mid (L3-L4)': { median: 280000, blsMedian: 230000 },
        'Senior (L5-L6)': { median: 420000, blsMedian: 350000 },
        'Staff+ (L7+)': { median: 650000, blsMedian: 520000 }
      }
    }
  },
  Meta: {
    'Software Engineer': {
      'San Francisco': {
        'Junior (L1-L2)': { median: 210000, blsMedian: 180000 },
        'Mid (L3-L4)': { median: 340000, blsMedian: 280000 },
        'Senior (L5-L6)': { median: 480000, blsMedian: 400000 },
        'Staff+ (L7+)': { median: 720000, blsMedian: 600000 }
      }
    }
  },
  Amazon: {
    'Software Engineer': {
      'Seattle': {
        'Junior (L1-L2)': { median: 190000, blsMedian: 170000 },
        'Mid (L3-L4)': { median: 310000, blsMedian: 260000 },
        'Senior (L5-L6)': { median: 440000, blsMedian: 370000 },
        'Staff+ (L7+)': { median: 660000, blsMedian: 550000 }
      }
    }
  }
  // More can be added for demo
};