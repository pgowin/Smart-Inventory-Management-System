export type LowStockSeverity = 'warning' | 'critical'

function getLowStockSeverity(
	quantity: number,
	reorderPoint: number,
): LowStockSeverity {
	if (quantity <= Math.max(1, Math.floor(reorderPoint / 2))) {
		return 'critical'
	}

	return 'warning'
}

export const alertsService = {
	isLowStock(quantity: number, reorderPoint: number): boolean {
		return quantity <= reorderPoint
	},

	getLowStockSeverity,
}
