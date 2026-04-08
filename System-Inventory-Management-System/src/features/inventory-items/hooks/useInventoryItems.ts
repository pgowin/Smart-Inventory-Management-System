import { useEffect, useState } from 'react'
import { localCacheKeys } from '../../../shared/utils/localCache'
import { inventoryItemsService } from '../services/inventoryItemsService'
import type { InventoryItem, InventoryItemInput } from '../types'

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

export function useInventoryItems() {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const cachedItems = loadItemsFromCache()
    if (cachedItems) {
      return cachedItems
    }

    return inventoryItemsService.getInitialItems()
  })

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

  return {
    items,
    addItem,
    editItem,
    deleteItem,
  }
}
