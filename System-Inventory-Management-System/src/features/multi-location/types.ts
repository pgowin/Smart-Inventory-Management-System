// Multi-location domain types.
export type StoreLocation = {
  id: string
  name: string
  city: string
  timezone: string
}

export type MultiviewMetrics = {
  locationCount: number
  totalUnits: number
  totalInventoryValue: number
  lowStockItems: number
}

export type LocationInventorySummary = {
  locationId: string
  locationName: string
  city: string
  timezone: string
  itemCount: number
  totalUnits: number
  totalInventoryValue: number
  lowStockItems: number
}

export type LocationInventoryRow = {
  itemId: string
  locationId: string
  locationName: string
  sku: string
  name: string
  category: string
  quantity: number
  reorderPoint: number
  unitPrice: number
  lowStock: boolean
}

export type TransferStockInput = {
  sourceItemId: string
  targetLocationId: string
  quantity: number
}

export type TransferPlan = {
  sourceItemId: string
  sourceNextQuantity: number
  targetExistingItemId: string | null
  targetLocationId: string
  transferQuantity: number
}
