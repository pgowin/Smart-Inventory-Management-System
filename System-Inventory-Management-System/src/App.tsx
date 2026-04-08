import './App.css'
import { useInventoryItems } from './features/inventory-items/hooks/useInventoryItems'
import { InventoryItemsView } from './features/inventory-items/components/InventoryItemsView'
import { StockLevelsView } from './features/stock-levels/components/StockLevelsView'
import { useLowStockAlerts } from './features/alerts/hooks/useLowStockAlerts'

function App() {
  const inventoryStore = useInventoryItems()
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
        <p>Manage inventory and adjust live stock counts in separate panels.</p>

        <div className="panels-grid">
          <InventoryItemsView inventoryStore={inventoryStore} />
          <StockLevelsView inventoryStore={inventoryStore} />
        </div>
      </main>
    </>
  )
}

export default App
