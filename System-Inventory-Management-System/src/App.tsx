import './App.css'
import { InventoryItemsView } from './features/inventory-items/components/InventoryItemsView'

function App() {
  return (
    <main className="app-shell">
      <h1>Smart Inventory Management System</h1>
      <p>Manage your inventory with simple add, edit, and delete actions.</p>
      <InventoryItemsView />
    </main>
  )
}

export default App
