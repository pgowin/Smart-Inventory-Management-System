# Inventory Items Feature Specification

## Objective
Enable users to manage product records from a single interface.

## Scope
- Add inventory items with required product details.
- Edit existing inventory items.
- Delete inventory items.
- Adjust quantity values from item controls.
- View expanded item details in dropdown/expandable rows.

## Functional Requirements
1. The system shall allow creation of a new inventory item with at least name, SKU, category, quantity, and unit price.
2. The system shall allow editing of existing item fields.
3. The system shall allow deleting an item with a clear user action.
4. The system shall display current quantity for each item.
5. The system shall support increment/decrement quantity controls and direct numeric input.
6. The system shall support filtering/search to find items quickly.

## Data Requirements
- Source data can be mock JSON and/or local state.
- Item updates should persist according to project persistence behavior (local cache/localStorage where configured).

## Acceptance Criteria
- User can add an item and immediately see it in the list.
- User can edit an item and view updated values without page reload.
- User can delete an item and it is removed from the list.
- User can increase/decrease quantity and manually set quantity.
- User can locate an item using available search/filter controls.
