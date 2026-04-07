"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Fuel, Leaf, Clock, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface RouteCardProps {
  routeName: string
  distance: string
  duration: string
  fuel: string
  co2: string
  isBestEco?: boolean
  isSelected?: boolean
  onClick?: () => void
}

export function RouteCard({
  routeName,
  distance,
  duration,
  fuel,
  co2,
  isBestEco = false,
  isSelected = false,
  onClick,
}: RouteCardProps) {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative cursor-pointer transition-all duration-300 hover:scale-[1.02] overflow-hidden",
        isBestEco
          ? "border-primary bg-gradient-to-br from-primary/10 via-primary/5 to-transparent"
          : "border-border hover:border-muted-foreground/30",
        isSelected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {isBestEco && (
        <div className="absolute top-0 right-0">
          <div className="bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold rounded-bl-lg flex items-center gap-1">
            <Leaf className="h-3 w-3" />
            Best Eco
          </div>
        </div>
      )}
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className={cn(
            "p-2 rounded-lg",
            isBestEco ? "bg-primary/20" : "bg-secondary"
          )}>
            <MapPin className={cn(
              "h-4 w-4",
              isBestEco ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          {routeName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Distance</p>
            <p className="text-xl font-semibold">{distance}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Clock className="h-3 w-3" /> Duration
            </p>
            <p className="text-xl font-semibold">{duration}</p>
          </div>
        </div>
        <div className="h-px bg-border" />
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <Fuel className="h-3 w-3" /> Fuel
            </p>
            <p className={cn(
              "text-xl font-semibold",
              isBestEco && "text-primary"
            )}>{fuel}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> CO2
            </p>
            <p className={cn(
              "text-xl font-semibold",
              isBestEco && "text-primary"
            )}>{co2}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
