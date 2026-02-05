'use client'

import { PerformanceData, formatILS, formatPercentage } from '@/lib/demo-data'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PerformanceCardProps {
  data: PerformanceData
  title?: string
}

export function PerformanceCard({ data, title = 'ביצועים' }: PerformanceCardProps) {
  const isPositive = data.pnl >= 0

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col" dir="rtl">
      <div className="flex flex-row-reverse items-center justify-end gap-2 mb-6">
        {isPositive ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>

      <div className="flex-1 flex flex-col justify-center text-right">
        <p className="text-sm text-muted-foreground mb-1">רווח/הפסד כולל</p>
        
        <div className="flex flex-row-reverse items-baseline justify-end gap-3 flex-wrap">
          <span
            className={cn(
              'text-sm font-medium px-2 py-0.5 rounded',
              isPositive 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            )}
          >
            {formatPercentage(data.pnlPercentage)}
          </span>
          
          <span
            className={cn(
              'text-3xl font-bold',
              isPositive ? 'text-green-500' : 'text-red-500'
            )}
          >
            {isPositive ? '+' : ''}{formatILS(data.pnl)}
          </span>
        </div>

        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm text-right">
            <div>
              <p className="text-muted-foreground">שווי נוכחי</p>
              <p className="font-medium text-foreground">{formatILS(data.currentValue)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">השקעה התחלתית</p>
              <p className="font-medium text-foreground">{formatILS(data.initialValue)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">נתוני דמו להמחשה</p>
      </div>
    </div>
  )
}
