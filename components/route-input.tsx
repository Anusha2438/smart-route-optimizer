"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Navigation, Search, ArrowRight } from "lucide-react"

interface RouteInputProps {
  source: string
  destination: string
  onSourceChange: (value: string) => void
  onDestinationChange: (value: string) => void
  onFindRoutes: () => void
  isLoading?: boolean
}

export function RouteInput({
  source,
  destination,
  onSourceChange,
  onDestinationChange,
  onFindRoutes,
  isLoading = false,
}: RouteInputProps) {
  const [vehicle, setVehicle] = useState("car");
  return (
    <Card className="border-border">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Source
            </label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Enter starting point..."
                value={source}
                onChange={(e) => onSourceChange(e.target.value)}
                className="pl-10 bg-input border-border focus:border-primary"
              />
            </div>
          </div>
          
          <div className="hidden lg:flex items-center justify-center pb-1">
            <div className="p-2 rounded-full bg-secondary">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          
          <div className="flex-1 space-y-2 w-full">
            <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
              <MapPin className="h-3 w-3" /> Destination
            </label>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                placeholder="Enter destination..."
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="pl-10 bg-input border-border focus:border-primary"
              />
            </div>
          </div>
          <div className="flex-1 space-y-2 w-full">
  <label className="text-xs text-muted-foreground uppercase tracking-wider">
    Vehicle Type
  </label>

  <select
    value={vehicle}
    onChange={(e) => setVehicle(e.target.value)}
    className="w-full p-2 border rounded bg-input border-border"
  >
    <option value="car">Car</option>
    <option value="bike">Bike</option>
    <option value="truck">Truck</option>
    <option value="bus">Bus</option>
    <option value="walk">Walking</option>
  </select>
</div>
          
          <Button
            onClick={onFindRoutes}
            disabled={isLoading || !source || !destination}
            className="w-full lg:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Finding...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Find Routes
              </div>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
