import { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface BentoCardProps {
  children: ReactNode
  className?: string
  background?: "lavender" | "mint" | "peach" | "sky" | "rose" | "amber" | "white"
  span?: "1x1" | "1x2" | "2x1" | "2x2"
}

const backgroundClasses = {
  lavender: "bg-lavender",
  mint: "bg-mint",
  peach: "bg-peach",
  sky: "bg-sky",
  rose: "bg-rose",
  amber: "bg-amber",
  white: "bg-white",
}

const spanClasses = {
  "1x1": "",
  "1x2": "md:col-span-1 md:row-span-2",
  "2x1": "md:col-span-2 md:row-span-1",
  "2x2": "md:col-span-2 md:row-span-2",
}

export function BentoCard({
  children,
  className,
  background = "white",
  span = "1x1",
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "bento-card",
        backgroundClasses[background],
        spanClasses[span],
        className
      )}
    >
      {children}
    </div>
  )
}

// Bento Grid Container
interface BentoGridProps {
  children: ReactNode
  columns?: 2 | 3 | 4
  className?: string
}

export function BentoGrid({ children, columns = 2, className }: BentoGridProps) {
  const gridClass = columns === 2 ? "bento-grid-2" : columns === 3 ? "bento-grid-3" : "bento-grid-2"

  return (
    <div className={cn("bento-grid", gridClass, className)}>
      {children}
    </div>
  )
}
