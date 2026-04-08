// Inventory item domain types.
export type InventoryItem = {
  id: string
  sku: string
  name: string
  category: string
  locationId: string
  quantity: number
  reorderPoint: number
  unitPrice: number
  updatedAt: string
}
