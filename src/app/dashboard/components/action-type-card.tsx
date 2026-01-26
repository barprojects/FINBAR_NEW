'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ActionTypeCardProps {
  icon: LucideIcon
  label: string
  description?: string
  onClick: () => void
  selected?: boolean
  className?: string
}

export function ActionTypeCard({
  icon: Icon,
  label,
  description,
  onClick,
  selected,
  className,
}: ActionTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center justify-center gap-3 p-4 rounded-xl border transition-all duration-300',
        'hover:shadow-md hover:scale-[1.02] active:scale-[0.98]',
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50',
        className
      )}
      type="button"
    >
      <div
        className={cn(
          'p-3 rounded-full transition-colors duration-300',
          selected
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary'
        )}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-center space-y-1">
        <span className={cn('block font-medium', selected ? 'text-primary' : 'text-foreground')}>
          {label}
        </span>
        {description && (
          <span className="block text-xs text-muted-foreground group-hover:text-muted-foreground/80">
            {description}
          </span>
        )}
      </div>
    </button>
  )
}
