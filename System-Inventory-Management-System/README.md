# Smart Inventory Management System (Frontend)

Cloud-based inventory management frontend for small retail stores.

## Functional Scope

- Add and edit inventory items
- Real-time stock level display
- Low-stock alert simulation
- Basic sales analytics using mock data
- Multi-location inventory view

## Data Strategy

No real backend is required at this stage.

- Mock JSON files in `src/data/mock/`
- In-memory state in feature hooks
- Local cache utilities in `src/shared/utils/localCache.ts`
- Mock API adapters in `src/api/mockApi.ts`

## Architecture

See `src/ARCHITECTURE.md` for the current folder layout and feature mapping.

Primary source folders:

- `src/features/inventory-items`
- `src/features/stock-levels`
- `src/features/alerts`
- `src/features/sales-analytics`
- `src/features/multi-location`
- `src/data`
- `src/api`
- `src/shared`

## Run

```bash
npm install
npm run dev
```
