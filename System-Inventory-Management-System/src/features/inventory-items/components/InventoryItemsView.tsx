import { useState } from 'react'
import type { InventoryItemsStore } from '../hooks/useInventoryItems'
import type { InventoryItem, InventoryItemInput } from '../types'
import { alertsService } from '../../alerts/services/alertsService'

function promptText(label: string, currentValue = '') {
  const value = window.prompt(label, currentValue)
  if (value === null) {
    return null
  }

  const trimmed = value.trim()
  if (!trimmed) {
    window.alert(`${label} is required.`)
    return null
  }

  return trimmed
}

function promptNumber(label: string, currentValue: number) {
  const value = window.prompt(label, String(currentValue))
  if (value === null) {
    return null
  }

  const numeric = Number(value)
  if (Number.isNaN(numeric) || numeric < 0) {
    window.alert(`${label} must be a valid number.`)
    return null
  }

  return numeric
}

function promptItemFields(seed?: InventoryItem): InventoryItemInput | null {
  const sku = promptText('SKU', seed?.sku ?? '')
  if (!sku) return null

  const name = promptText('Item name', seed?.name ?? '')
  if (!name) return null

  const category = promptText('Category', seed?.category ?? '')
  if (!category) return null

  const locationId = promptText(
    'Location ID (example: loc-001)',
    seed?.locationId ?? 'loc-001',
  )
  if (!locationId) return null

  const quantity = promptNumber('Quantity', seed?.quantity ?? 0)
  if (quantity === null) return null

  const reorderPoint = promptNumber('Reorder point', seed?.reorderPoint ?? 0)
  if (reorderPoint === null) return null

  const unitPrice = promptNumber('Unit price', seed?.unitPrice ?? 0)
  if (unitPrice === null) return null

  return {
    sku,
    name,
    category,
    locationId,
    quantity,
    reorderPoint,
    unitPrice,
  }
}

type InventoryItemsViewProps = {
  inventoryStore: InventoryItemsStore
}

export function InventoryItemsView({ inventoryStore }: InventoryItemsViewProps) {
  const { items, addItem, editItem, deleteItem, adjustItemQuantity } = inventoryStore
  const [quantityDrafts, setQuantityDrafts] = useState<Record<string, string>>({})

  const handleAddItem = () => {
    const newItemInput = promptItemFields()
    if (!newItemInput) {
      return
    }

    addItem(newItemInput)
  }

  const handleEditItem = (item: InventoryItem) => {
    const editInput = promptItemFields(item)
    if (!editInput) {
      return
    }

    editItem(item.id, editInput)
  }

  const handleDeleteItem = (id: string, name: string) => {
    const confirmed = window.confirm(`Delete ${name}?`)
    if (!confirmed) {
      return
    }

    deleteItem(id)
  }

  const handleSetQuantity = (item: InventoryItem, nextQuantity: number) => {
    if (Number.isNaN(nextQuantity)) {
      return
    }

    const normalizedQuantity = Math.max(0, Math.floor(nextQuantity))
    editItem(item.id, {
      sku: item.sku,
      name: item.name,
      category: item.category,
      locationId: item.locationId,
      quantity: normalizedQuantity,
      reorderPoint: item.reorderPoint,
      unitPrice: item.unitPrice,
    })
  }

  const handleQuantityChange = (itemId: string, value: string) => {
    if (!/^\d*$/.test(value)) {
      return
    }

    setQuantityDrafts((current) => ({
      ...current,
      [itemId]: value,
    }))
  }

  const commitQuantityDraft = (item: InventoryItem) => {
    const rawDraft = quantityDrafts[item.id]
    const nextQuantity = rawDraft === '' || rawDraft === undefined ? 0 : Number(rawDraft)

    handleSetQuantity(item, nextQuantity)

    setQuantityDrafts((current) => {
      const next = { ...current }
      delete next[item.id]
      return next
    })
  }

  return (
    <section className="inventory-items">
      <div className="inventory-items__header">
        <h2>Inventory Items</h2>
        <button type="button" onClick={handleAddItem}>
          Add Item
        </button>
      </div>

      <div className="inventory-items__list">
        {items.map((item) => (
          <details className="inventory-item-dropdown" key={item.id}>
            <summary className="inventory-item-dropdown__summary">
              <div>
                <h3>{item.name}</h3>
                <p>
                  {item.sku} • {item.category}
                </p>
              </div>

              <div className="inventory-item-dropdown__summary-meta">
                <span>Qty: {item.quantity}</span>
                {alertsService.isLowStock(item.quantity, item.reorderPoint) && (
                  <span
                    className={`stock-alert-badge ${alertsService.getLowStockSeverity(item.quantity, item.reorderPoint)}`}
                  >
                    Low Stock
                  </span>
                )}
              </div>
            </summary>

            <div className="inventory-item-dropdown__details">
              <p>SKU: {item.sku}</p>
              <p>Category: {item.category}</p>
              <p>Location: {item.locationId}</p>
              <div className="inventory-item-quantity-editor">
                <span>Quantity</span>
                <div className="inventory-item-quantity-editor__controls">
                  <button
                    type="button"
                    aria-label={`Decrease stock for ${item.name}`}
                    onClick={() => adjustItemQuantity(item.id, -1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={quantityDrafts[item.id] ?? String(item.quantity)}
                    onChange={(event) => handleQuantityChange(item.id, event.target.value)}
                    onBlur={() => commitQuantityDraft(item)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.currentTarget.blur()
                      }
                    }}
                    aria-label={`Quantity for ${item.name}`}
                  />
                  <button
                    type="button"
                    aria-label={`Increase stock for ${item.name}`}
                    onClick={() => adjustItemQuantity(item.id, 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              <p>Reorder Point: {item.reorderPoint}</p>
              <p>Unit Price: ${item.unitPrice.toFixed(2)}</p>

              <div className="inventory-item-card__actions">
                <button type="button" onClick={() => handleEditItem(item)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="danger"
                  onClick={() => handleDeleteItem(item.id, item.name)}
                >
                  Delete
                </button>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
