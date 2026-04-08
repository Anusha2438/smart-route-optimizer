"use client"

import { useState } from "react"
import { RouteInput } from "@/components/route-input"
import { RouteCard } from "@/components/route-card"
import { StatsCard } from "@/components/stats-card"
import { Leaf, TrendingDown, Fuel, Route as RouteIcon, TreePine, Sparkles } from "lucide-react"

interface RouteData {
  id: string
  name: string
  distance: string
  duration: string
  fuel: string
  co2: string
  isBestEco: boolean
  trafficScore?: number
  congestionLevel?: string
}

function calculateFuelLiters(distanceKm: number) {
  return distanceKm / 15
}

function calculateCo2Kg(fuelLiters: number) {
  return fuelLiters * 2.3
}

function formatNumber(value: number, decimals = 2) {
  return value.toFixed(decimals)
}

function buildRoute(id: string, name: string, distanceKm: number): RouteData {
  const fuelLiters = calculateFuelLiters(distanceKm)
  const co2Kg = calculateCo2Kg(fuelLiters)

  return {
    id,
    name,
    distance: `${distanceKm} km`,
    duration: "—",
    fuel: `${formatNumber(fuelLiters)} L`,
    co2: `${formatNumber(co2Kg)} kg`,
    isBestEco: false, // computed later
  }
}

const sampleRoutesBase = [
  { id: "A", name: "Route A", isBestEco: false },
  { id: "B", name: "Route B", isBestEco: true },
  { id: "C", name: "Route C", isBestEco: false },
]

export default function EcoRouteOptimizer() {
  const [source, setSource] = useState("")
  const [destination, setDestination] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [routes, setRoutes] = useState<RouteData[]>([])
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null)
  const [showResults, setShowResults] = useState(false)

  const handleFindRoutes = async () => {
    setIsLoading(true)
    setShowResults(false)
  
    // TODO: Replace this with real API later
    await new Promise((resolve) => setTimeout(resolve, 1500))
  
    // Fake traffic delay (for now)
    const updatedRoutes = sampleRoutesBase.map((route) => {
      const trafficDelay = Math.floor(Math.random() * 400)
  
      let congestionLevel = "LOW"
      if (trafficDelay > 300) congestionLevel = "HIGH"
      else if (trafficDelay > 120) congestionLevel = "MEDIUM"
  
      return {
        ...route,
      
        // 🚀 ADD THESE (IMPORTANT)
        distance: `${10 + Math.floor(Math.random() * 10)} km`,
      
        duration: `${15 + Math.floor(trafficDelay / 60)} mins`,
      
        fuel: `${(1 + Math.random()).toFixed(2)} L`,
      
        co2: `${(2 + Math.random()).toFixed(2)} kg`,
      
        // 🚦 Your traffic logic
        trafficScore: trafficDelay,
        congestionLevel: congestionLevel,
      }
    })
  
    const best = updatedRoutes.reduce((min, r) => {
      const rCo2 = Number.parseFloat(r.co2)
      const minCo2 = Number.parseFloat(min.co2)
      return rCo2 < minCo2 ? r : min
    }, updatedRoutes[0])

    const finalRoutes = updatedRoutes.map((r) => ({
      ...r,
      isBestEco: r.id === best.id,
    }))

    setRoutes(finalRoutes)
    setSelectedRoute(best.id)
    setShowResults(true)
    setIsLoading(false)
  }
  const co2Saved =
    showResults && routes.length > 0
      ? `${formatNumber(
          routes.reduce((sum, r) => sum + Number.parseFloat(r.co2), 0) / routes.length -
            Number.parseFloat(routes.find((r) => r.isBestEco)?.co2 ?? routes[0].co2)
        )} kg`
      : "—"

  const fuelSaved =
    showResults && routes.length > 0
      ? `${formatNumber(
          routes.reduce((sum, r) => sum + Number.parseFloat(r.fuel), 0) / routes.length -
            Number.parseFloat(routes.find((r) => r.isBestEco)?.fuel ?? routes[0].fuel)
        )} L`
      : "—"

  const treesEquivalent =
    showResults && routes.length > 0 ? formatNumber(Number.parseFloat(co2Saved) / 21, 2) : "—"

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <div>
              <h1 className="text-xl font-bold text-foreground">
🌱 Eco-Friendly Route Suggestion
</h1>
                <p className="text-xs text-muted-foreground">Find greener paths, reduce your footprint</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Input Section */}
        <section>
          <RouteInput
            source={source}
            destination={destination}
            onSourceChange={setSource}
            onDestinationChange={setDestination}
            onFindRoutes={handleFindRoutes}
            isLoading={isLoading}
          />
        </section>

        {/* Stats Overview */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {showResults ? "Savings Summary" : "Potential Savings"}
            </h2>
            {showResults && (
              <span className="px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full">
                Best Route Selected
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatsCard
              title="CO2 Saved"
              value={co2Saved}
              subtitle={showResults ? "vs average route" : "Enter route to calculate"}
              icon={TrendingDown}
              highlight={showResults}
            />
            <StatsCard
              title="Fuel Saved"
              value={fuelSaved}
              subtitle={showResults ? "vs average route" : "Enter route to calculate"}
              icon={Fuel}
              highlight={showResults}
            />
            <StatsCard
              title="Trees Equivalent"
              value={treesEquivalent}
              subtitle={showResults ? "trees planted per trip" : "Enter route to calculate"}
              icon={TreePine}
              highlight={showResults}
            />
          </div>
        </section>
        {/* Eco Tips Section */}
{showResults && (
  <section className="mt-6">
    <div className="p-4 rounded-xl border bg-green-50">
      <h2 className="text-sm font-semibold text-green-700 mb-2">
        💡 Eco Tips
      </h2>

      <ul className="text-sm text-green-800 space-y-1">
        <li>• Avoid peak traffic hours to reduce fuel consumption</li>
        <li>• Maintain a steady speed for better mileage</li>
        <li>• Use eco-friendly routes suggested by the system</li>
      </ul>
    </div>
  </section>
)}

        {/* Routes Section */}
        {showResults && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
          {/* Map Section */}
<div className="mt-8">
  <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">
    Route Map
  </h2>

  <iframe
    src={`https://www.google.com/maps?q=${source || "Chennai"}+to+${destination || "Bangalore"}&output=embed`}
    width="100%"
    height="400"
    style={{ border: 0, borderRadius: "12px" }}
    loading="lazy"
  ></iframe>
</div>
            <div className="flex items-center gap-2 mb-4">
              <RouteIcon className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Available Routes
              </h2>
              <span className="text-xs text-muted-foreground">({routes.length} found)</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {routes.map((route) => (
                <RouteCard
                  key={route.id}
                  routeName={route.name}
                  distance={route.distance}
                  duration={route.duration}
                  fuel={route.fuel}
                  co2={route.co2}
                  isBestEco={route.isBestEco}
                  isSelected={selectedRoute === route.id}
                  onClick={() => setSelectedRoute(route.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!showResults && !isLoading && (
          <section className="text-center py-16">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-secondary mb-4">
              <RouteIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Ready to optimize your route</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Enter your source and destination above to discover eco-friendly routes that save fuel and reduce CO2 emissions.
            </p>
          </section>
        )}

        {/* Loading State */}
        {isLoading && (
          <section className="text-center py-16 animate-pulse">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/20 mb-4">
              <Leaf className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Analyzing routes...</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Our AI is calculating the most eco-friendly paths for your journey.
            </p>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Leaf className="h-3 w-3 text-primary" />
              <span>Making transportation greener, one route at a time</span>
            </div>
            <div className="flex items-center gap-4">
              <span>Data powered by eco-analytics</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
