"use client"

import * as React from "react"
import ReactCalendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import "./calendar.css"

import { cn } from "@/lib/utils"

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export interface CalendarProps {
  className?: string
  selected?: Date
  onSelect?: (date: Date | undefined) => void
  locale?: string
}

function Calendar({
  className,
  selected,
  onSelect,
  locale = "he-IL",
}: CalendarProps) {
  const handleChange = (value: Value) => {
    if (value instanceof Date) {
      onSelect?.(value)
    } else if (Array.isArray(value) && value[0] instanceof Date) {
      onSelect?.(value[0])
    } else {
      onSelect?.(undefined)
    }
  }

  return (
    <div className={cn("calendar-wrapper", className)}>
      <ReactCalendar
        onChange={handleChange}
        value={selected}
        locale={locale}
        calendarType="hebrew"
        prev2Label={null}
        next2Label={null}
        minDetail="month"
        formatShortWeekday={(locale, date) => 
          date.toLocaleDateString(locale, { weekday: 'narrow' })
        }
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }
