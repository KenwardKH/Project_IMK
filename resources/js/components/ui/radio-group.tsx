import * as React from "react"
import {
  Root as RadioGroupRoot,
  Item as RadioGroupItemPrimitive,
  Indicator,
} from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupRoot>,
  React.ComponentPropsWithoutRef<typeof RadioGroupRoot>
>(({ className, ...props }, ref) => (
  <RadioGroupRoot ref={ref} className={cn("grid gap-2", className)} {...props} />
))
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupItemPrimitive>,
  React.ComponentPropsWithoutRef<typeof RadioGroupItemPrimitive>
>(({ className, ...props }, ref) => (
  <RadioGroupItemPrimitive
    ref={ref}
    className={cn(
      "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    <Indicator className="flex items-center justify-center">
      <div className="h-2.5 w-2.5 rounded-full bg-current" />
    </Indicator>
  </RadioGroupItemPrimitive>
))
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
