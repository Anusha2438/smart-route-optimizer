"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string
  subtitle?: string
  icon: LucideIcon
  trend?: "up" | "down"
  highlight?: boolean
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  highlight = false,
}: StatsCardProps) {
  return (
    <Card className={cn(
      "border-border transition-all",
      highlight && "border-primary bg-gradient-to-br from-primary/10 to-transparent"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className={cn(
              "text-2xl font-bold",
              highlight && "text-primary"
            )}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "p-2 rounded-lg",
            highlight ? "bg-primary/20" : "bg-secondary"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              highlight ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
