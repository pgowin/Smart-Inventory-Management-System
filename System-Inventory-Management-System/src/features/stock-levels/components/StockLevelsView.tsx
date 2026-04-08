import type { InventoryItemsStore } from '../../inventory-items/hooks/useInventoryItems'
import { alertsService } from '../../alerts/services/alertsService'

type StockLevelsViewProps = {
  inventoryStore: InventoryItemsStore
}

export function StockLevelsView({ inventoryStore }: StockLevelsViewProps) {
  const { items, adjustItemQuantity } = inventoryStore

  return (
    <section className="stock-levels-panel">
      <div className="stock-levels-panel__header">
        <h2>Real-Time Stock Levels</h2>
        <p>Use + or - to adjust units for each item.</p>
      </div>

      <div className="stock-levels-panel__list">
        {items.map((item) => (
          <article className="stock-level-card" key={item.id}>
            <div>
              <h3>{item.name}</h3>
              <p>{item.sku}</p>
              {alertsService.isLowStock(item.quantity, item.reorderPoint) && (
                <p
                  className={`stock-alert-text ${alertsService.getLowStockSeverity(item.quantity, item.reorderPoint)}`}
                >
                  Low stock alert
                </p>
              )}
            </div>

            <div className="stock-level-card__controls">
              <button
                type="button"
                aria-label={`Decrease stock for ${item.name}`}
                onClick={() => adjustItemQuantity(item.id, -1)}
              >
                -
              </button>
              <strong>{item.quantity}</strong>
              <button
                type="button"
                aria-label={`Increase stock for ${item.name}`}
                onClick={() => adjustItemQuantity(item.id, 1)}
              >
                +
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
