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

export type LowStockNotification = {
  id: string
  itemId: string
  itemName: string
  sku: string
  currentQuantity: number
  reorderPoint: number
  severity: 'warning' | 'critical'
  createdAt: string
}
