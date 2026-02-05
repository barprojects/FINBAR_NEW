'use client'

import { useState, useEffect } from 'react'
import { PortfolioChart } from '@/components/dashboard/portfolio-chart'
import { DateRangeSelector } from '@/components/dashboard/date-range-selector'
import { PerformanceCard } from '@/components/dashboard/performance-card'
import {
  DateRange,
  ChartDataPoint,
  PerformanceData,
  generateDemoChartData,
  calculatePerformance,
  formatILS,
} from '@/lib/demo-data'

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('ALL')
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    pnl: 0,
    pnlPercentage: 0,
    currentValue: 0,
    initialValue: 0,
  })
  const [isClient, setIsClient] = useState(false)

  // Generate data only on client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
    const data = generateDemoChartData(dateRange)
    setChartData(data)
    setPerformanceData(calculatePerformance(data))
  }, [])

  // Regenerate when date range changes
  useEffect(() => {
    if (!isClient) return
    const data = generateDemoChartData(dateRange)
    setChartData(data)
    setPerformanceData(calculatePerformance(data))
  }, [dateRange, isClient])

  const currentValue = chartData.length > 0 ? chartData[chartData.length - 1].value : 0

  // Loading skeleton
  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6" dir="ltr">
          <div className="order-2 md:order-1 w-full md:w-[300px] flex-shrink-0">
            <div className="bg-card border border-border rounded-lg p-6 h-full animate-pulse" dir="rtl">
              <div className="h-6 bg-muted rounded w-24 mb-6 ms-auto" />
              <div className="h-10 bg-muted rounded w-32 mb-4 ms-auto" />
              <div className="h-4 bg-muted rounded w-20 ms-auto" />
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 order-1 md:order-2 flex-1">
            <div className="flex justify-between items-start mb-4" dir="rtl">
              <div className="h-8 bg-muted rounded w-32" />
              <div className="h-8 bg-muted rounded w-48" />
            </div>
            <div className="h-[400px] bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Main Layout - Chart on RIGHT, Performance on LEFT */}
      <div className="flex flex-col md:flex-row gap-6" dir="ltr">
        {/* Performance Card - LEFT side */}
        <div className="order-2 md:order-1 w-full md:w-[300px] flex-shrink-0">
          <PerformanceCard data={performanceData} />
        </div>

        {/* Chart Section - RIGHT side */}
        <div className="bg-card border border-border rounded-lg p-6 order-1 md:order-2 flex-1">
          {/* Chart Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6" dir="rtl">
            <div className="text-right">
              <h2 className="text-lg font-semibold text-foreground">שווי תיק</h2>
              <p className="text-3xl font-bold text-foreground mt-1">
                {formatILS(currentValue)}
              </p>
            </div>

            {/* Date Range Selector */}
            <DateRangeSelector
              selected={dateRange}
              onChange={setDateRange}
            />
          </div>

          {/* Chart */}
          <PortfolioChart data={chartData} height={400} />
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          הגרף מציג נתוני דמו להמחשה בלבד
        </p>
      </div>
    </div>
  )
}
