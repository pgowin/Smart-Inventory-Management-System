import { act, renderHook } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { useInventoryItems } from '../hooks/useInventoryItems'
import type { InventoryItemInput } from '../types'

describe('useInventoryItems', () => {
  test('adds, adjusts quantity, edits, and deletes an inventory item', () => {
    const { result } = renderHook(() => useInventoryItems())

    const initialCount = result.current.items.length
    const newItemInput: InventoryItemInput = {
      sku: 'SKU-TST-999',
      name: 'Test Item',
      category: 'Testing',
      locationId: 'loc-001',
      quantity: 10,
      reorderPoint: 5,
      unitPrice: 12.5,
    }

    act(() => {
      result.current.addItem(newItemInput)
    })

    expect(result.current.items).toHaveLength(initialCount + 1)
    expect(result.current.items[0]).toMatchObject(newItemInput)

    const addedItemId = result.current.items[0].id

    act(() => {
      result.current.adjustItemQuantity(addedItemId, 3)
    })

    expect(result.current.items[0].quantity).toBe(13)

    act(() => {
      result.current.adjustItemQuantity(addedItemId, -5)
    })

    expect(result.current.items[0].quantity).toBe(8)

    const editInput: InventoryItemInput = {
      ...newItemInput,
      name: 'Edited Test Item',
      unitPrice: 15,
    }

    act(() => {
      result.current.editItem(addedItemId, editInput)
    })

    expect(result.current.items[0]).toMatchObject(editInput)

    act(() => {
      result.current.deleteItem(addedItemId)
    })

    expect(result.current.items).toHaveLength(initialCount)
    expect(result.current.items.some((item) => item.id === addedItemId)).toBe(false)
  })
})
