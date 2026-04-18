import { useMemo, useState } from 'react'
import type { InventoryItemsStore } from '../../inventory-items/hooks/useInventoryItems'
import { useMultiLocationInventory } from '../hooks/useMultiLocationInventory'
import type { StoreLocation } from '../types'

type MultiLocationInventoryViewProps = {
  inventoryStore: InventoryItemsStore
  locations: StoreLocation[]
  selectedLocationId: string
  onLocationChange: (locationId: string) => void
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

export function MultiLocationInventoryView({
  inventoryStore,
  locations,
  selectedLocationId,
  onLocationChange,
}: MultiLocationInventoryViewProps) {
  const {
    locationSummaries,
    currentLocationSummary,
    filteredRows,
    transferableItems,
    adjustItemQuantity,
    transferStock,
  } = useMultiLocationInventory(inventoryStore, selectedLocationId, locations)

  const [sourceItemId, setSourceItemId] = useState<string>('')
  const [targetLocationId, setTargetLocationId] = useState<string>('')
  const [quantityToTransfer, setQuantityToTransfer] = useState<number>(1)
  const [transferMessage, setTransferMessage] = useState<string>('')
  const [transferError, setTransferError] = useState<string>('')

  const sourceItem = useMemo(
    () => transferableItems.find((item) => item.id === sourceItemId) ?? null,
    [sourceItemId, transferableItems],
  )

  const destinationOptions = useMemo(() => {
    if (!sourceItem) {
      return locations
    }

    return locations.filter((location) => location.id !== sourceItem.locationId)
  }, [locations, sourceItem])

  const handleTransferSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTransferMessage('')
    setTransferError('')

    if (!sourceItemId) {
      setTransferError('Choose an inventory item to transfer from.')
      return
    }

    if (!targetLocationId) {
      setTransferError('Choose a destination location.')
      return
    }

    try {
      const message = transferStock({
        sourceItemId,
        targetLocationId,
        quantity: quantityToTransfer,
      })

      setTransferMessage(message)
      setQuantityToTransfer(1)
    } catch (error) {
      setTransferError(
        error instanceof Error ? error.message : 'Transfer could not be completed.',
      )
    }
  }

  return (
    <section className="multiview-panel">
      <div className="multiview-panel__header">
        <h2>Multiview Dashboard</h2>
        <p>
          Monitor and manage stock across locations from one operational view.
        </p>
        <label className="multiview-filter">
          <span>Location Page</span>
          <select
            value={selectedLocationId}
            onChange={(event) => onLocationChange(event.target.value)}
          >
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="multiview-metrics-grid">
        <article className="multiview-metric-card">
          <h3>Location</h3>
          <p>{currentLocationSummary.locationName}</p>
        </article>
        <article className="multiview-metric-card">
          <h3>Total Units</h3>
          <p>{currentLocationSummary.totalUnits}</p>
        </article>
        <article className="multiview-metric-card">
          <h3>Inventory Value</h3>
          <p>{formatCurrency(currentLocationSummary.totalInventoryValue)}</p>
        </article>
        <article className="multiview-metric-card">
          <h3>Low Stock Items</h3>
          <p>{currentLocationSummary.lowStockItems}</p>
        </article>
      </div>

      <div className="multiview-grid">
        <section className="multiview-card">
          <div className="multiview-card__header">
            <h3>Location Visibility</h3>
            <p>
              {currentLocationSummary.city} - {currentLocationSummary.timezone}
            </p>
          </div>

          <table className="multiview-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Items</th>
                <th>Units</th>
                <th>Value</th>
                <th>Low Stock</th>
              </tr>
            </thead>
            <tbody>
              {locationSummaries.map((location) => (
                <tr key={location.locationId}>
                  <td>
                    <strong>{location.locationName}</strong>
                    <p>
                      {location.city} - {location.timezone}
                    </p>
                  </td>
                  <td>{location.itemCount}</td>
                  <td>{location.totalUnits}</td>
                  <td>{formatCurrency(location.totalInventoryValue)}</td>
                  <td>{location.lowStockItems}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="multiview-card">
          <div className="multiview-card__header">
            <h3>Inventory for {currentLocationSummary.locationName}</h3>
            <p>{filteredRows.length} entries in view</p>
          </div>

          <div className="multiview-item-list">
            {filteredRows.map((row) => (
              <article className="multiview-item-card" key={row.itemId}>
                <div>
                  <h4>{row.name}</h4>
                  <p>
                    {row.sku} - {row.category}
                  </p>
                  <p>{row.locationName}</p>
                  {row.lowStock && <span className="stock-alert-badge critical">Low Stock</span>}
                </div>

                <div className="multiview-item-card__controls">
                  <button
                    type="button"
                    aria-label={`Decrease stock for ${row.name}`}
                    onClick={() => adjustItemQuantity(row.itemId, -1)}
                  >
                    -
                  </button>
                  <strong>{row.quantity}</strong>
                  <button
                    type="button"
                    aria-label={`Increase stock for ${row.name}`}
                    onClick={() => adjustItemQuantity(row.itemId, 1)}
                  >
                    +
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="multiview-card multiview-card--transfer">
        <div className="multiview-card__header">
          <h3>Cross-Location Transfer</h3>
          <p>Move stock between locations to rebalance demand quickly.</p>
        </div>

        <form className="multiview-transfer-form" onSubmit={handleTransferSubmit}>
          <label>
            Source Item
            <select
              value={sourceItemId}
              onChange={(event) => {
                const nextItemId = event.target.value
                setSourceItemId(nextItemId)

                const nextItem = transferableItems.find(
                  (item) => item.id === nextItemId,
                )
                if (!nextItem) {
                  setTargetLocationId('')
                  return
                }

                const nextDestination = locations.find(
                  (location) => location.id !== nextItem.locationId,
                )
                setTargetLocationId(nextDestination?.id ?? '')
              }}
            >
              <option value="">Choose item</option>
              {transferableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku}) - {item.quantity} units
                </option>
              ))}
            </select>
          </label>

          <label>
            Destination
            <select
              value={targetLocationId}
              onChange={(event) => setTargetLocationId(event.target.value)}
            >
              <option value="">Choose location</option>
              {destinationOptions.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Units
            <input
              type="number"
              min={1}
              max={sourceItem?.quantity ?? 1}
              value={quantityToTransfer}
              onChange={(event) => setQuantityToTransfer(Number(event.target.value))}
            />
          </label>

          <button type="submit">Transfer Stock</button>
        </form>

        {transferMessage && <p className="multiview-transfer-status">{transferMessage}</p>}
        {transferError && (
          <p className="multiview-transfer-status multiview-transfer-status--error">
            {transferError}
          </p>
        )}
      </section>
    </section>
  )
}
