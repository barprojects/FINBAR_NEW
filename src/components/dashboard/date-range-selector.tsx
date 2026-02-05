'use client'

import { DateRange } from '@/lib/demo-data'
import { cn } from '@/lib/utils'

interface DateRangeSelectorProps {
  selected: DateRange
  onChange: (range: DateRange) => void
}

const DATE_RANGES: { value: DateRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '7D', label: '7D' },
  { value: '1M', label: '1M' },
  { value: '3M', label: '3M' },
  { value: 'YTD', label: 'YTD' },
  { value: 'ALL', label: 'ALL' },
]

export function DateRangeSelector({ selected, onChange }: DateRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-muted rounded-lg" dir="ltr">
      {DATE_RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
            selected === range.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  )
}
