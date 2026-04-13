import { useEffect, useState } from 'react'
import { localCacheKeys } from '../../../shared/utils/localCache'
import { inventoryItemsService } from '../services/inventoryItemsService'
import type { InventoryItem, InventoryItemInput } from '../types'

export type InventoryItemsStore = {
  items: InventoryItem[]
  addItem: (input: InventoryItemInput) => void
  editItem: (id: string, input: InventoryItemInput) => void
  deleteItem: (id: string) => void
  adjustItemQuantity: (id: string, delta: number) => void
}

function loadItemsFromCache(): InventoryItem[] | null {
  const raw = localStorage.getItem(localCacheKeys.inventoryItems)
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw) as InventoryItem[]
    return parsed
  } catch {
    return null
  }
}

function hydrateItems(cachedItems: InventoryItem[] | null): InventoryItem[] {
  const seedItems = inventoryItemsService.getInitialItems()
  if (!cachedItems) {
    return seedItems
  }

  const cachedById = new Set(cachedItems.map((item) => item.id))
  const missingSeedItems = seedItems.filter((item) => !cachedById.has(item.id))

  return [...cachedItems, ...missingSeedItems]
}

export function useInventoryItems(): InventoryItemsStore {
  const [items, setItems] = useState<InventoryItem[]>(() =>
    hydrateItems(loadItemsFromCache()),
  )

  useEffect(() => {
    localStorage.setItem(localCacheKeys.inventoryItems, JSON.stringify(items))
  }, [items])

  const addItem = (input: InventoryItemInput) => {
    const newItem = inventoryItemsService.createItem(input)
    setItems((current) => [newItem, ...current])
  }

  const editItem = (id: string, input: InventoryItemInput) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? inventoryItemsService.updateItem(item, input) : item,
      ),
    )
  }

  const deleteItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id))
  }

  const adjustItemQuantity = (id: string, delta: number) => {
    setItems((current) =>
      current.map((item) => {
        if (item.id !== id) {
          return item
        }

        return {
          ...item,
          quantity: Math.max(0, item.quantity + delta),
          updatedAt: new Date().toISOString(),
        }
      }),
    )
  }

  return {
    items,
    addItem,
    editItem,
    deleteItem,
    adjustItemQuantity,
  }
}
