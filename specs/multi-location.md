# Multi-Location Inventory Feature Specification

## Objective
Allow inventory operations across multiple store or warehouse locations from one application.

## Scope
- Maintain inventory context per location.
- Switch active location in the dashboard.
- Show location-specific metrics and inventory lists.
- Transfer stock between locations.

## Functional Requirements
1. The system shall define multiple locations with identifiers and display names.
2. The system shall allow changing the active location context.
3. The system shall update inventory list and metrics to match active location.
4. The system shall support cross-location transfer of item quantities.
5. The system shall prevent invalid transfers (for example insufficient source quantity).

## Data Requirements
- Each location shall maintain its own item quantity records.
- Transfer operations shall update source and destination balances atomically in UI state.

## Acceptance Criteria
- User can switch locations and immediately see location-specific values.
- Transfer action decreases source stock and increases destination stock for the selected item.
- Invalid transfers are blocked and do not corrupt inventory state.
