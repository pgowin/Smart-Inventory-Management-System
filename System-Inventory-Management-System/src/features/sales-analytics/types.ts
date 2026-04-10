// Sales analytics domain types.
export type SalesRecord = {
  id: string
  itemId: string
  locationId: string
  unitsSold: number
  revenue: number
  soldAt: string
}

export type SalesSummary = {
  transactions: number
  totalUnitsSold: number
  totalRevenue: number
  averageOrderValue: number
}

export type DailyRevenuePoint = {
  date: string
  totalRevenue: number
  unitsSold: number
  transactions: number
}

export type ItemPerformance = {
  itemId: string
  itemName: string
  unitsSold: number
  totalRevenue: number
  transactions: number
}

export type LocationPerformance = {
  locationId: string
  locationName: string
  unitsSold: number
  totalRevenue: number
  transactions: number
}
