// Alert domain types.
export type LowStockAlert = {
  id: string
  itemId: string
  locationId: string
  currentQuantity: number
  reorderPoint: number
  severity: 'warning' | 'critical'
  createdAt: string
}
