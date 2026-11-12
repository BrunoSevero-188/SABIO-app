'use client'

import { forwardRef, RadioHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface RadioGroupProps {
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ value, onValueChange, children, disabled, ...props }, ref) => {
    return (
      <div ref={ref} {...props}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { value, onValueChange, disabled })
          }
          return child
        })}
      </div>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'

interface RadioGroupItemProps extends Omit<RadioHTMLAttributes<HTMLInputElement>, 'type' | 'checked'> {
  value: string
}

const RadioGroupItem = forwardRef<HTMLInputElement, RadioGroupItemProps>(
  ({ value, className, disabled, ...props }, ref) => {
    const checked = props.value === value

    return (
      <input
        ref={ref}
        type="radio"
        value={value}
        checked={checked}
        onChange={(e) => {
          if (props.onChange) props.onChange(e)
        }}
        disabled={disabled}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-full border-border text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        {...props}
      />
    )
  }
)
RadioGroupItem.displayName = 'RadioGroupItem'

export { RadioGroup, RadioGroupItem }