import './App.css'
import { useInventoryItems } from './features/inventory-items/hooks/useInventoryItems'
import { InventoryItemsView } from './features/inventory-items/components/InventoryItemsView'
import { StockLevelsView } from './features/stock-levels/components/StockLevelsView'

function App() {
  const inventoryStore = useInventoryItems()

  return (
    <main className="app-shell">
      <h1>Smart Inventory Management System</h1>
      <p>Manage inventory and adjust live stock counts in separate panels.</p>

      <div className="panels-grid">
        <InventoryItemsView inventoryStore={inventoryStore} />
        <StockLevelsView inventoryStore={inventoryStore} />
      </div>
    </main>
  )
}

export default App
