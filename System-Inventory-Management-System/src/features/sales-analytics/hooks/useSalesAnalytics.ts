import { useMemo } from 'react'
import { salesAnalyticsService } from '../services/salesAnalyticsService'

export function useSalesAnalytics(locationId: string) {
  const records = useMemo(
    () =>
      salesAnalyticsService
        .getSalesRecords()
        .filter((record) => record.locationId === locationId),
    [locationId],
  )

  const summary = useMemo(
    () => salesAnalyticsService.getSummary(records),
    [records],
  )

  const dailyRevenue = useMemo(
    () => salesAnalyticsService.getDailyRevenue(records),
    [records],
  )

  const topItems = useMemo(
    () => salesAnalyticsService.getTopItems(records, 5),
    [records],
  )

  const locationPerformance = useMemo(
    () => salesAnalyticsService.getLocationPerformance(records),
    [records],
  )

  const maxDailyRevenue = useMemo(
    () => Math.max(...dailyRevenue.map((point) => point.totalRevenue), 0),
    [dailyRevenue],
  )

  const recentTransactions = useMemo(
    () => [...records].sort((a, b) => b.soldAt.localeCompare(a.soldAt)).slice(0, 8),
    [records],
  )

  return {
    summary,
    dailyRevenue,
    maxDailyRevenue,
    topItems,
    locationPerformance,
    recentTransactions,
  }
}
