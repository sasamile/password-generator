import { Suspense } from "react"
import { getElementStats, getVisitStats } from "@/actions/analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCards } from "@/components/analytics/stats-cards"
import { VisitChart } from "@/components/analytics/visit-chart"

export default async function AnalyticsPage() {
  const elementStats = await getElementStats()
  const visitStats = await getVisitStats()

  if (!elementStats || !visitStats) {
    return <div>Please sign in to view analytics</div>
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
      </div>
      <Suspense fallback={<div>Loading stats...</div>}>
        <StatsCards
          totalElements={elementStats.totalElements}
          averageStrength={elementStats.averageStrength}
        />
      </Suspense>
      <Suspense fallback={<div>Loading visit data...</div>}>
        <VisitChart data={visitStats.visitData} />
      </Suspense>
      <Card>
        <CardHeader>
          <CardTitle>Elements by Type</CardTitle>
          <CardDescription>
            Distribution of your stored elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(elementStats.elementsByType).map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between rounded-md p-2 hover:bg-muted"
              >
                <div className="font-medium capitalize">{type}</div>
                <div>{count}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

