// Sample financial data for the Quartr prototype
export const companies = [
  {
    id: 1,
    symbol: 'AAPL',
    name: 'Apple Inc.',
    sector: 'Technology',
    marketCap: 3200000000000,
    price: 195.45,
    change: 2.34,
    changePercent: 1.21,
    volume: 45234567,
    pe: 28.5,
    dividend: 0.96,
    beta: 1.2,
    earnings: {
      q1: 89.5,
      q2: 95.2,
      q3: 101.3,
      q4: 108.7
    },
    recentNews: [
      { title: 'Apple Reports Strong Q4 Earnings', date: '2024-01-15', sentiment: 'positive' },
      { title: 'iPhone Sales Beat Expectations', date: '2024-01-10', sentiment: 'positive' }
    ]
  },
  {
    id: 2,
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    sector: 'Technology',
    marketCap: 2800000000000,
    price: 378.92,
    change: -4.23,
    changePercent: -1.10,
    volume: 23456789,
    pe: 32.1,
    dividend: 2.72,
    beta: 0.9,
    earnings: {
      q1: 72.4,
      q2: 78.1,
      q3: 83.7,
      q4: 89.2
    },
    recentNews: [
      { title: 'Microsoft Azure Growth Slows', date: '2024-01-12', sentiment: 'negative' },
      { title: 'AI Integration Drives Revenue', date: '2024-01-08', sentiment: 'positive' }
    ]
  },
  {
    id: 3,
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    sector: 'Technology',
    marketCap: 1900000000000,
    price: 142.87,
    change: 1.45,
    changePercent: 1.03,
    volume: 34567890,
    pe: 24.8,
    dividend: 0.0,
    beta: 1.1,
    earnings: {
      q1: 68.9,
      q2: 74.6,
      q3: 80.5,
      q4: 86.2
    },
    recentNews: [
      { title: 'Google Search Revenue Rebounds', date: '2024-01-14', sentiment: 'positive' },
      { title: 'YouTube Ad Revenue Grows 15%', date: '2024-01-09', sentiment: 'positive' }
    ]
  },
  {
    id: 4,
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    sector: 'Automotive',
    marketCap: 850000000000,
    price: 248.73,
    change: 12.45,
    changePercent: 5.27,
    volume: 67890123,
    pe: 45.2,
    dividend: 0.0,
    beta: 2.1,
    earnings: {
      q1: 23.3,
      q2: 24.9,
      q3: 25.2,
      q4: 29.5
    },
    recentNews: [
      { title: 'Tesla Deliveries Exceed Expectations', date: '2024-01-13', sentiment: 'positive' },
      { title: 'New Gigafactory Announced', date: '2024-01-07', sentiment: 'positive' }
    ]
  },
  {
    id: 5,
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    sector: 'Technology',
    marketCap: 2100000000000,
    price: 875.28,
    change: 15.67,
    changePercent: 1.82,
    volume: 45678901,
    pe: 65.4,
    dividend: 0.16,
    beta: 1.8,
    earnings: {
      q1: 14.9,
      q2: 13.5,
      q3: 18.1,
      q4: 22.1
    },
    recentNews: [
      { title: 'AI Chip Demand Surges', date: '2024-01-16', sentiment: 'positive' },
      { title: 'Data Center Revenue Hits Record', date: '2024-01-11', sentiment: 'positive' }
    ]
  }
];

export const marketIndices = [
  { name: 'S&P 500', value: 4789.45, change: 23.67, changePercent: 0.50 },
  { name: 'NASDAQ', value: 15234.78, change: -45.23, changePercent: -0.30 },
  { name: 'Dow Jones', value: 37856.23, change: 156.89, changePercent: 0.42 }
];

export const sectorPerformance = [
  { sector: 'Technology', performance: 2.3, companies: 45 },
  { sector: 'Healthcare', performance: 1.8, companies: 32 },
  { sector: 'Financial', performance: -0.5, companies: 28 },
  { sector: 'Energy', performance: 3.2, companies: 15 },
  { sector: 'Consumer', performance: 0.9, companies: 22 },
  { sector: 'Industrial', performance: 1.2, companies: 18 }
];

export const earningsCalendar = [
  { symbol: 'AAPL', name: 'Apple Inc.', date: '2024-01-25', time: 'After Market', estimate: 2.18 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', date: '2024-01-24', time: 'After Market', estimate: 2.78 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', date: '2024-01-30', time: 'After Market', estimate: 1.65 },
  { symbol: 'TSLA', name: 'Tesla Inc.', date: '2024-01-26', time: 'After Market', estimate: 0.73 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', date: '2024-01-28', time: 'After Market', estimate: 4.56 }
];

export const recentTranscripts = [
  {
    id: 1,
    company: 'Apple Inc.',
    symbol: 'AAPL',
    type: 'Earnings Call',
    date: '2024-01-15',
    quarter: 'Q4 2023',
    keyTopics: ['iPhone Sales', 'Services Growth', 'China Market', 'AI Integration'],
    sentiment: 'positive',
    highlights: [
      'iPhone revenue up 6% year-over-year',
      'Services revenue reaches new record',
      'Strong performance in emerging markets'
    ]
  },
  {
    id: 2,
    company: 'Microsoft Corporation',
    symbol: 'MSFT',
    type: 'Earnings Call',
    date: '2024-01-12',
    quarter: 'Q2 2024',
    keyTopics: ['Azure Growth', 'AI Copilot', 'Productivity Suite', 'Gaming'],
    sentiment: 'mixed',
    highlights: [
      'Azure growth slows to 28%',
      'AI Copilot gaining traction',
      'Strong demand for Microsoft 365'
    ]
  }
];

export const aiInsights = [
  {
    id: 1,
    title: 'Tech Sector Earnings Momentum',
    summary: 'Technology companies showing strong earnings growth driven by AI adoption and cloud services expansion.',
    confidence: 85,
    category: 'Sector Analysis',
    date: '2024-01-16'
  },
  {
    id: 2,
    title: 'EV Market Consolidation',
    summary: 'Electric vehicle market showing signs of consolidation with Tesla maintaining leadership position.',
    confidence: 78,
    category: 'Industry Trend',
    date: '2024-01-15'
  },
  {
    id: 3,
    title: 'Interest Rate Impact',
    summary: 'Potential Fed rate cuts could benefit growth stocks, particularly in technology sector.',
    confidence: 72,
    category: 'Market Outlook',
    date: '2024-01-14'
  }
];

export const chartData = {
  stockPrices: [
    { date: '2024-01-01', AAPL: 185.64, MSFT: 374.58, GOOGL: 140.93, TSLA: 238.45, NVDA: 481.18 },
    { date: '2024-01-02', AAPL: 187.42, MSFT: 372.13, GOOGL: 142.17, TSLA: 245.32, NVDA: 495.22 },
    { date: '2024-01-03', AAPL: 184.25, MSFT: 375.89, GOOGL: 139.87, TSLA: 251.67, NVDA: 512.89 },
    { date: '2024-01-04', AAPL: 189.33, MSFT: 378.45, GOOGL: 141.23, TSLA: 247.93, NVDA: 528.34 },
    { date: '2024-01-05', AAPL: 191.56, MSFT: 376.78, GOOGL: 143.45, TSLA: 249.12, NVDA: 545.67 },
    { date: '2024-01-08', AAPL: 193.89, MSFT: 380.12, GOOGL: 142.87, TSLA: 248.73, NVDA: 568.91 },
    { date: '2024-01-09', AAPL: 195.45, MSFT: 378.92, GOOGL: 142.87, TSLA: 248.73, NVDA: 875.28 }
  ],
  volumeData: [
    { date: '2024-01-01', volume: 42000000 },
    { date: '2024-01-02', volume: 38500000 },
    { date: '2024-01-03', volume: 51200000 },
    { date: '2024-01-04', volume: 45800000 },
    { date: '2024-01-05', volume: 39700000 },
    { date: '2024-01-08', volume: 47300000 },
    { date: '2024-01-09', volume: 45234567 }
  ]
};