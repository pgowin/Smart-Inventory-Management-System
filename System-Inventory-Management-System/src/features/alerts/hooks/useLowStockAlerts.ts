import { useEffect, useRef, useState } from 'react'
import { alertsService } from '../services/alertsService'
import type { LowStockNotification } from '../types'
import type { InventoryItem } from '../../inventory-items/types'

const NOTIFICATION_TIMEOUT_MS = 5000

export function useLowStockAlerts(items: InventoryItem[]) {
  const [notifications, setNotifications] = useState<LowStockNotification[]>([])
  const previousLowStockMap = useRef<Record<string, boolean>>({})
  const initialized = useRef(false)

  useEffect(() => {
    const currentLowStockMap: Record<string, boolean> = {}
    const enteredLowStockNotifications: LowStockNotification[] = []

    for (const item of items) {
      const isLowStock = alertsService.isLowStock(item.quantity, item.reorderPoint)
      const wasLowStock = previousLowStockMap.current[item.id] ?? false
      currentLowStockMap[item.id] = isLowStock

      if (initialized.current && isLowStock && !wasLowStock) {
        enteredLowStockNotifications.push({
          id: `${item.id}-${Date.now()}`,
          itemId: item.id,
          itemName: item.name,
          sku: item.sku,
          currentQuantity: item.quantity,
          reorderPoint: item.reorderPoint,
          severity: alertsService.getLowStockSeverity(
            item.quantity,
            item.reorderPoint,
          ),
          createdAt: new Date().toISOString(),
        })
      }
    }

    previousLowStockMap.current = currentLowStockMap

    if (!initialized.current) {
      initialized.current = true
      return
    }

    if (enteredLowStockNotifications.length > 0) {
      setNotifications((current) => [
        ...enteredLowStockNotifications,
        ...current,
      ].slice(0, 6))
    }
  }, [items])

  useEffect(() => {
    if (notifications.length === 0) {
      return
    }

    const newestId = notifications[0].id
    const timer = window.setTimeout(() => {
      setNotifications((current) =>
        current.filter((notification) => notification.id !== newestId),
      )
    }, NOTIFICATION_TIMEOUT_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [notifications])

  const dismissNotification = (id: string) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id),
    )
  }

  return {
    notifications,
    dismissNotification,
  }
}
