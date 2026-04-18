import { useMemo, useState } from 'react'
import './App.css'
import { useInventoryItems } from './features/inventory-items/hooks/useInventoryItems'
import { InventoryItemsView } from './features/inventory-items/components/InventoryItemsView'
import { useLowStockAlerts } from './features/alerts/hooks/useLowStockAlerts'
import { SalesAnalyticsView } from './features/sales-analytics/components/SalesAnalyticsView'
import { MultiLocationInventoryView } from './features/multi-location/components/MultiLocationInventoryView'
import { multiLocationService } from './features/multi-location/services/multiLocationService'

function App() {
  const inventoryStore = useInventoryItems()
  const locations = useMemo(() => multiLocationService.getLocations(), [])
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    locations[0]?.id ?? '',
  )
  const selectedLocation = useMemo(
    () => locations.find((location) => location.id === selectedLocationId) ?? null,
    [locations, selectedLocationId],
  )

  const { notifications, dismissNotification } = useLowStockAlerts(
    inventoryStore.items,
  )

  return (
    <>
      <aside className="toast-container" aria-live="polite" aria-atomic="true">
        {notifications.map((notification) => (
          <article
            className={`toast ${notification.severity}`}
            key={notification.id}
          >
            <div>
              <h4>Low stock warning</h4>
              <p>
                {notification.itemName} ({notification.sku}) reached low stock.
              </p>
              <p>
                {notification.currentQuantity} units left. Reorder point is{' '}
                {notification.reorderPoint}.
              </p>
            </div>
            <button
              type="button"
              className="toast-close"
              aria-label="Dismiss notification"
              onClick={() => dismissNotification(notification.id)}
            >
              x
            </button>
          </article>
        ))}
      </aside>

      <main className="app-shell">
        <h1>Smart Inventory Management System</h1>
        <p>Manage inventory and adjust stock counts directly from each item.</p>

        <div className="panels-grid">
          <InventoryItemsView
            inventoryStore={inventoryStore}
            locationId={selectedLocationId}
            locationName={selectedLocation?.name ?? selectedLocationId}
          />
          <MultiLocationInventoryView
            inventoryStore={inventoryStore}
            locations={locations}
            selectedLocationId={selectedLocationId}
            onLocationChange={setSelectedLocationId}
          />
          <SalesAnalyticsView
            locationId={selectedLocationId}
            locationName={selectedLocation?.name ?? selectedLocationId}
          />
        </div>
      </main>
    </>
  )
}

export default App
