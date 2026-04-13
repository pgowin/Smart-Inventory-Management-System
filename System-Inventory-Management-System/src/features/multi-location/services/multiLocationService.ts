import locationsData from '../../../data/mock/locations.json'
import type { InventoryItem } from '../../inventory-items/types'
import { alertsService } from '../../alerts/services/alertsService'
import type {
	LocationInventoryRow,
	LocationInventorySummary,
	MultiviewMetrics,
	StoreLocation,
	TransferPlan,
	TransferStockInput,
} from '../types'

const locations = locationsData as StoreLocation[]

function roundCurrency(value: number) {
	return Number(value.toFixed(2))
}

function getLocationNameById(locationId: string) {
	return locations.find((location) => location.id === locationId)?.name ?? locationId
}

function countLowStock(items: InventoryItem[]) {
	return items.filter((item) =>
		alertsService.isLowStock(item.quantity, item.reorderPoint),
	).length
}

export const multiLocationService = {
	getLocations(): StoreLocation[] {
		return [...locations]
	},

	getMultiviewMetrics(items: InventoryItem[]): MultiviewMetrics {
		const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0)
		const totalInventoryValue = items.reduce(
			(sum, item) => sum + item.quantity * item.unitPrice,
			0,
		)

		return {
			locationCount: locations.length,
			totalUnits,
			totalInventoryValue: roundCurrency(totalInventoryValue),
			lowStockItems: countLowStock(items),
		}
	},

	getLocationSummaries(items: InventoryItem[]): LocationInventorySummary[] {
		return locations.map((location) => {
			const locationItems = items.filter((item) => item.locationId === location.id)
			const totalUnits = locationItems.reduce((sum, item) => sum + item.quantity, 0)
			const totalInventoryValue = locationItems.reduce(
				(sum, item) => sum + item.quantity * item.unitPrice,
				0,
			)

			return {
				locationId: location.id,
				locationName: location.name,
				city: location.city,
				timezone: location.timezone,
				itemCount: locationItems.length,
				totalUnits,
				totalInventoryValue: roundCurrency(totalInventoryValue),
				lowStockItems: countLowStock(locationItems),
			}
		})
	},

	getLocationInventoryRows(items: InventoryItem[]): LocationInventoryRow[] {
		return [...items]
			.map((item) => ({
				itemId: item.id,
				locationId: item.locationId,
				locationName: getLocationNameById(item.locationId),
				sku: item.sku,
				name: item.name,
				category: item.category,
				quantity: item.quantity,
				reorderPoint: item.reorderPoint,
				unitPrice: item.unitPrice,
				lowStock: alertsService.isLowStock(item.quantity, item.reorderPoint),
			}))
			.sort((a, b) => {
				if (a.locationName !== b.locationName) {
					return a.locationName.localeCompare(b.locationName)
				}

				if (a.lowStock !== b.lowStock) {
					return a.lowStock ? -1 : 1
				}

				return a.name.localeCompare(b.name)
			})
	},

	buildTransferPlan(items: InventoryItem[], input: TransferStockInput): TransferPlan {
		const source = items.find((item) => item.id === input.sourceItemId)
		if (!source) {
			throw new Error('Source item could not be found.')
		}

		const normalizedQuantity = Math.floor(input.quantity)
		if (normalizedQuantity <= 0) {
			throw new Error('Transfer quantity must be at least 1.')
		}

		if (source.locationId === input.targetLocationId) {
			throw new Error('Choose a different destination location.')
		}

		if (source.quantity < normalizedQuantity) {
			throw new Error('Transfer quantity exceeds available source stock.')
		}

		const targetLocationExists = locations.some(
			(location) => location.id === input.targetLocationId,
		)
		if (!targetLocationExists) {
			throw new Error('Destination location is invalid.')
		}

		const targetExisting = items.find(
			(item) =>
				item.locationId === input.targetLocationId &&
				item.sku === source.sku &&
				item.name === source.name,
		)

		return {
			sourceItemId: source.id,
			sourceNextQuantity: source.quantity - normalizedQuantity,
			targetExistingItemId: targetExisting?.id ?? null,
			targetLocationId: input.targetLocationId,
			transferQuantity: normalizedQuantity,
		}
	},
}
