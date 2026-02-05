export type DateRange = '1D' | '7D' | '1M' | '3M' | 'YTD' | 'ALL'

export interface ChartDataPoint {
  time: string // YYYY-MM-DD format
  value: number
}

export interface PerformanceData {
  pnl: number
  pnlPercentage: number
  currentValue: number
  initialValue: number
}

// Format date as YYYY-MM-DD
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
}

// Get start date based on range
function getStartDate(range: DateRange): Date {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  
  switch (range) {
    case '1D':
      return today
    case '7D':
      return new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    case '1M':
      return new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
    case '3M':
      return new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())
    case 'YTD':
      return new Date(today.getFullYear(), 0, 1)
    case 'ALL':
    default:
      return new Date(today.getFullYear() - 2, today.getMonth(), today.getDate())
  }
}

// Generate demo chart data with realistic volatility
export function generateDemoChartData(range: DateRange): ChartDataPoint[] {
  const startDate = getStartDate(range)
  const endDate = new Date()
  const data: ChartDataPoint[] = []
  
  let value = 50000 // Starting value in ILS
  
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000))
  const pointCount = Math.max(daysDiff, 1)
  
  for (let i = 0; i <= pointCount; i++) {
    const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
    
    if (currentDate > endDate) break
    
    // Realistic volatility
    const volatility = 0.02
    const trend = 0.001
    const randomChange = (Math.random() - 0.5) * 2 * volatility
    const change = trend + randomChange
    
    value = value * (1 + change)
    value = Math.max(value, 10000)
    
    data.push({
      time: formatDate(currentDate),
      value: Math.round(value * 100) / 100
    })
  }
  
  return data
}

// Calculate performance from chart data
export function calculatePerformance(data: ChartDataPoint[]): PerformanceData {
  if (data.length === 0) {
    return { pnl: 0, pnlPercentage: 0, currentValue: 0, initialValue: 0 }
  }
  
  const initialValue = data[0].value
  const currentValue = data[data.length - 1].value
  const pnl = currentValue - initialValue
  const pnlPercentage = ((currentValue - initialValue) / initialValue) * 100
  
  return { pnl, pnlPercentage, currentValue, initialValue }
}

// Format as ILS currency
export function formatILS(value: number): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

// Format percentage
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(2)}%`
}
