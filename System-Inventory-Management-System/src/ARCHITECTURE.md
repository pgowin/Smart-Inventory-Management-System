# Smart Inventory Frontend Architecture

## Goals
- Keep business domains separated by feature.
- Use mock data and in-memory state with optional local caching.
- Prepare for a future backend without major folder changes.

## Folder Layout

```text
src/
  api/
    mockApi.ts
  data/
    README.md
    mock/
      inventory-items.json
      stock-levels.json
      sales-records.json
      locations.json
  features/
    README.md
    inventory-items/
    stock-levels/
    alerts/
    sales-analytics/
    multi-location/
  shared/
    components/
    types/
    utils/
```

## Feature Mapping
- Add and edit inventory items: `features/inventory-items`
- Real-time stock level display: `features/stock-levels`
- Low-stock alerts: `features/alerts`
- Basic sales analytics: `features/sales-analytics`
- Multi-location inventory view: `features/multi-location`
