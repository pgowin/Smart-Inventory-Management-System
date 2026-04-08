// Stock level domain types.
export type StockLevel = {
  itemId: string
  locationId: string
  available: number
  reserved: number
  incoming: number
  status: 'healthy' | 'low' | 'critical'
}
