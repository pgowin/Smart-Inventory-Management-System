import salesRecordsData from '../../../data/mock/sales-records.json'
import inventoryItemsData from '../../../data/mock/inventory-items.json'
import locationsData from '../../../data/mock/locations.json'
import type {
	DailyRevenuePoint,
	ItemPerformance,
	LocationPerformance,
	SalesRecord,
	SalesSummary,
} from '../types'

type InventoryLookup = {
	id: string
	name: string
}

type LocationLookup = {
	id: string
	name: string
}

const inventoryById = new Map<string, InventoryLookup>(
	(inventoryItemsData as InventoryLookup[]).map((item) => [item.id, item]),
)

const locationsById = new Map<string, LocationLookup>(
	(locationsData as LocationLookup[]).map((location) => [location.id, location]),
)

function toDayKey(soldAt: string) {
	return soldAt.slice(0, 10)
}

function roundCurrency(value: number) {
	return Number(value.toFixed(2))
}

function sortByRevenueDesc<T extends { totalRevenue: number }>(rows: T[]) {
	return [...rows].sort((a, b) => b.totalRevenue - a.totalRevenue)
}

export const salesAnalyticsService = {
	getSalesRecords(): SalesRecord[] {
		return [...(salesRecordsData as SalesRecord[])]
	},

	getSummary(records: SalesRecord[]): SalesSummary {
		const totalRevenue = records.reduce((sum, record) => sum + record.revenue, 0)
		const totalUnitsSold = records.reduce(
			(sum, record) => sum + record.unitsSold,
			0,
		)
		const transactions = records.length

		return {
			transactions,
			totalUnitsSold,
			totalRevenue: roundCurrency(totalRevenue),
			averageOrderValue:
				transactions > 0 ? roundCurrency(totalRevenue / transactions) : 0,
		}
	},

	getDailyRevenue(records: SalesRecord[]): DailyRevenuePoint[] {
		const map = new Map<string, DailyRevenuePoint>()

		for (const record of records) {
			const key = toDayKey(record.soldAt)
			const current = map.get(key)

			if (current) {
				current.totalRevenue += record.revenue
				current.unitsSold += record.unitsSold
				current.transactions += 1
				continue
			}

			map.set(key, {
				date: key,
				totalRevenue: record.revenue,
				unitsSold: record.unitsSold,
				transactions: 1,
			})
		}

		return Array.from(map.values())
			.map((point) => ({
				...point,
				totalRevenue: roundCurrency(point.totalRevenue),
			}))
			.sort((a, b) => a.date.localeCompare(b.date))
	},

	getTopItems(records: SalesRecord[], limit = 5): ItemPerformance[] {
		const map = new Map<string, ItemPerformance>()

		for (const record of records) {
			const existing = map.get(record.itemId)
			if (existing) {
				existing.unitsSold += record.unitsSold
				existing.totalRevenue += record.revenue
				existing.transactions += 1
				continue
			}

			map.set(record.itemId, {
				itemId: record.itemId,
				itemName: inventoryById.get(record.itemId)?.name ?? record.itemId,
				unitsSold: record.unitsSold,
				totalRevenue: record.revenue,
				transactions: 1,
			})
		}

		return sortByRevenueDesc(
			Array.from(map.values()).map((row) => ({
				...row,
				totalRevenue: roundCurrency(row.totalRevenue),
			})),
		).slice(0, limit)
	},

	getLocationPerformance(records: SalesRecord[]): LocationPerformance[] {
		const map = new Map<string, LocationPerformance>()

		for (const record of records) {
			const existing = map.get(record.locationId)
			if (existing) {
				existing.unitsSold += record.unitsSold
				existing.totalRevenue += record.revenue
				existing.transactions += 1
				continue
			}

			map.set(record.locationId, {
				locationId: record.locationId,
				locationName: locationsById.get(record.locationId)?.name ?? record.locationId,
				unitsSold: record.unitsSold,
				totalRevenue: record.revenue,
				transactions: 1,
			})
		}

		return sortByRevenueDesc(
			Array.from(map.values()).map((row) => ({
				...row,
				totalRevenue: roundCurrency(row.totalRevenue),
			})),
		)
	},
}
