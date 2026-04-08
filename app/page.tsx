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

    try {
      const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY

      const origin = "12.9716,77.5946"
      const dest = "13.0827,80.2707"

      const url = `https://apis.mappls.com/advancedmaps/v1/${apiKey}/route_adv/driving/${origin};${dest}?alternatives=true`

      const res = await fetch(url)
      const data = await res.json()

      const updatedRoutes: RouteData[] = data.routes.map((route: any, index: number) => {
        const distanceKm = route.distance / 1000
        const durationMin = Math.round(route.duration / 60)

        const fuelLiters = calculateFuelLiters(distanceKm)
        const co2Kg = calculateCo2Kg(fuelLiters)

        return {
          id: `route-${index}`,
          name: `Route ${String.fromCharCode(65 + index)}`,
          distance: `${distanceKm.toFixed(1)} km`,
          duration: `${durationMin} mins`,
          fuel: `${formatNumber(fuelLiters)} L`,
          co2: `${formatNumber(co2Kg)} kg`,
          trafficScore: route.duration,
          congestionLevel: "LIVE",
          isBestEco: false,
        }
      })

      // find best route (safe numeric parsing)
      const best = updatedRoutes.reduce((min, r) => {
        const rCo2 = parseFloat(r.co2.split(" ")[0])
        const minCo2 = parseFloat(min.co2.split(" ")[0])
        return rCo2 < minCo2 ? r : min
      })

      const finalRoutes = updatedRoutes.map((r) => ({
        ...r,
        isBestEco: r.id === best.id,
      }))

      setRoutes(finalRoutes)
      setSelectedRoute(best.id)
      setShowResults(true)
    } catch (err) {
      console.error("Route fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  // SAFE stats calculation
  const co2Values = routes.map((r) => parseFloat(r.co2.split(" ")[0]))
  const fuelValues = routes.map((r) => parseFloat(r.fuel.split(" ")[0]))

  const bestRoute = routes.find((r) => r.isBestEco)

  const co2Saved =
    showResults && routes.length > 0 && bestRoute
      ? formatNumber(
          co2Values.reduce((a, b) => a + b, 0) / routes.length -
            parseFloat(bestRoute.co2.split(" ")[0])
        )
      : "—"

  const fuelSaved =
    showResults && routes.length > 0 && bestRoute
      ? formatNumber(
          fuelValues.reduce((a, b) => a + b, 0) / routes.length -
            parseFloat(bestRoute.fuel.split(" ")[0])
        )
      : "—"

  const treesEquivalent =
    showResults && routes.length > 0 && bestRoute
      ? formatNumber(Number(co2Saved) / 21)
      : "—"

  return (
    <main className="min-h-screen bg-background">

      {/* HEADER */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">🌱 Eco-Friendly Route Suggestion</h1>
              <p className="text-xs text-muted-foreground">
                Find greener paths, reduce your footprint
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            AI-Powered Analysis
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">

        {/* INPUT */}
        <RouteInput
          source={source}
          destination={destination}
          onSourceChange={setSource}
          onDestinationChange={setDestination}
          onFindRoutes={handleFindRoutes}
          isLoading={isLoading}
        />

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatsCard
            title="CO2 Saved"
            value={`${co2Saved} kg`}
            subtitle="vs average route"
            icon={TrendingDown}
            highlight={showResults}
          />
          <StatsCard
            title="Fuel Saved"
            value={`${fuelSaved} L`}
            subtitle="vs average route"
            icon={Fuel}
            highlight={showResults}
          />
          <StatsCard
            title="Trees Equivalent"
            value={treesEquivalent}
            subtitle="trees impact"
            icon={TreePine}
            highlight={showResults}
          />
        </div>

        {/* MAP */}
        {showResults && (
          <div className="mt-8">
            <h2 className="text-sm font-medium mb-3">Route Map</h2>

            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                `${source || "Chennai"} to ${destination || "Bangalore"}`
              )}&output=embed`}
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: "12px" }}
              loading="lazy"
            />
          </div>
        )}

        {/* ROUTES */}
        {showResults && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <RouteIcon className="h-4 w-4" />
              <h2 className="text-sm font-medium">Available Routes</h2>
              <span className="text-xs">({routes.length})</span>
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
                  congestionLevel={route.congestionLevel}
                  isBestEco={route.isBestEco}
                  isSelected={selectedRoute === route.id}
                  onClick={() => setSelectedRoute(route.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!showResults && !isLoading && (
          <div className="text-center py-16">
            <Leaf className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">Ready to optimize your route</h3>
            <p className="text-sm text-muted-foreground">
              Enter source and destination to begin
            </p>
          </div>
        )}

        {/* LOADING */}
        {isLoading && (
          <div className="text-center py-16">
            <Leaf className="h-10 w-10 mx-auto animate-spin text-primary mb-3" />
            <h3 className="text-lg font-medium">Analyzing routes...</h3>
          </div>
        )}
      </div>
    </main>
  )
}