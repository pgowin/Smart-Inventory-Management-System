import type { InventoryItem, InventoryItemInput } from '../types'
import initialInventoryItems from '../../../data/mock/inventory-items.json'

function makeId() {
	return `item-${Date.now()}`
}

export const inventoryItemsService = {
	getInitialItems(): InventoryItem[] {
		return [...(initialInventoryItems as InventoryItem[])]
	},

	createItem(input: InventoryItemInput): InventoryItem {
		return {
			id: makeId(),
			...input,
			updatedAt: new Date().toISOString(),
		}
	},

	updateItem(item: InventoryItem, patch: InventoryItemInput): InventoryItem {
		return {
			...item,
			...patch,
			updatedAt: new Date().toISOString(),
		}
	},
}
