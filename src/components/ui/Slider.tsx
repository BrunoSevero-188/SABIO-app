'use client'

import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  value: number[]
  onValueChange: (value: number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, min = 0, max = 100, step = 1, disabled, ...props }, ref) => {
    const percentage = ((value[0] - min) / (max - min)) * 100

    return (
      <div className={cn('relative w-full', className)}>
        <div
          className="relative h-2 bg-muted rounded-full overflow-hidden"
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value[0]}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            let newValue = value[0]
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              newValue = Math.min(max, value[0] + step)
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              newValue = Math.max(min, value[0] - step)
            }
            if (newValue !== value[0]) {
              onValueChange([newValue])
            }
          }}
        >
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${percentage}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-100"
            style={{ left: `${percentage}%` }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => onValueChange([parseFloat(e.target.value)])}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          {...props}
        />
      </div>
    )
  }
)

Slider.displayName = 'Slider'