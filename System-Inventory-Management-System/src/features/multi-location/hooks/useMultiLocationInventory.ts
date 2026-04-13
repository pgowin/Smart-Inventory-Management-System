import { useMemo, useState } from 'react'
import type { InventoryItemInput } from '../../inventory-items/types'
import type { InventoryItemsStore } from '../../inventory-items/hooks/useInventoryItems'
import { multiLocationService } from '../services/multiLocationService'
import type { TransferStockInput } from '../types'

function toInventoryItemInput(
  sourceItem: InventoryItemsStore['items'][number],
  patch: Partial<InventoryItemInput> = {},
): InventoryItemInput {
  return {
    sku: sourceItem.sku,
    name: sourceItem.name,
    category: sourceItem.category,
    locationId: sourceItem.locationId,
    quantity: sourceItem.quantity,
    reorderPoint: sourceItem.reorderPoint,
    unitPrice: sourceItem.unitPrice,
    ...patch,
  }
}

export function useMultiLocationInventory(inventoryStore: InventoryItemsStore) {
  const [selectedLocationId, setSelectedLocationId] = useState<string>('all')

  const { items, addItem, editItem, adjustItemQuantity } = inventoryStore

  const locations = useMemo(() => multiLocationService.getLocations(), [])

  const metrics = useMemo(
    () => multiLocationService.getMultiviewMetrics(items),
    [items],
  )

  const locationSummaries = useMemo(
    () => multiLocationService.getLocationSummaries(items),
    [items],
  )

  const inventoryRows = useMemo(
    () => multiLocationService.getLocationInventoryRows(items),
    [items],
  )

  const filteredRows = useMemo(
    () =>
      selectedLocationId === 'all'
        ? inventoryRows
        : inventoryRows.filter((row) => row.locationId === selectedLocationId),
    [inventoryRows, selectedLocationId],
  )

  const transferableItems = useMemo(
    () => items.filter((item) => item.quantity > 0),
    [items],
  )

  const transferStock = (input: TransferStockInput): string => {
    const plan = multiLocationService.buildTransferPlan(items, input)

    const sourceItem = items.find((item) => item.id === plan.sourceItemId)
    if (!sourceItem) {
      throw new Error('Source item was not found while applying transfer.')
    }

    editItem(
      sourceItem.id,
      toInventoryItemInput(sourceItem, { quantity: plan.sourceNextQuantity }),
    )

    if (plan.targetExistingItemId) {
      const targetItem = items.find((item) => item.id === plan.targetExistingItemId)
      if (!targetItem) {
        throw new Error('Target item was not found while applying transfer.')
      }

      editItem(
        targetItem.id,
        toInventoryItemInput(targetItem, {
          quantity: targetItem.quantity + plan.transferQuantity,
        }),
      )
    } else {
      addItem(
        toInventoryItemInput(sourceItem, {
          locationId: plan.targetLocationId,
          quantity: plan.transferQuantity,
        }),
      )
    }

    const destination = locations.find(
      (location) => location.id === plan.targetLocationId,
    )

    return `Transferred ${plan.transferQuantity} units to ${destination?.name ?? plan.targetLocationId}.`
  }

  return {
    locations,
    metrics,
    locationSummaries,
    selectedLocationId,
    setSelectedLocationId,
    filteredRows,
    transferableItems,
    adjustItemQuantity,
    transferStock,
  }
}
