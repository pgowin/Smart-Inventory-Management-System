import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useMemo, useState } from 'react'
import { describe, expect, test } from 'vitest'
import { useInventoryItems } from '../../inventory-items/hooks/useInventoryItems'
import { MultiLocationInventoryView } from '../components/MultiLocationInventoryView'
import { multiLocationService } from '../services/multiLocationService'

function MultiLocationTestHarness() {
  const inventoryStore = useInventoryItems()
  const locations = useMemo(() => multiLocationService.getLocations(), [])
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    locations[0]?.id ?? '',
  )

  return (
    <MultiLocationInventoryView
      inventoryStore={inventoryStore}
      locations={locations}
      selectedLocationId={selectedLocationId}
      onLocationChange={setSelectedLocationId}
    />
  )
}

describe('MultiLocationInventoryView', () => {
  test('changes location, adjusts quantity, and transfers stock to another location', async () => {
    render(<MultiLocationTestHarness />)

    const locationSelect = screen.getByLabelText('Location Page')
    expect(
      screen.getByRole('heading', { name: 'Inventory for Downtown Store' }),
    ).toBeTruthy()

    fireEvent.change(locationSelect, { target: { value: 'loc-002' } })

    expect(
      screen.getByRole('heading', { name: 'Inventory for Northside Store' }),
    ).toBeTruthy()

    expect(
      screen.getByRole('option', {
        name: 'Whole Milk 1L (SKU-MLK-002) - 14 units',
      }),
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole('button', { name: 'Increase stock for Whole Milk 1L' }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('option', {
          name: 'Whole Milk 1L (SKU-MLK-002) - 15 units',
        }),
      ).toBeTruthy()
    })

    fireEvent.click(
      screen.getByRole('button', { name: 'Decrease stock for Whole Milk 1L' }),
    )

    await waitFor(() => {
      expect(
        screen.getByRole('option', {
          name: 'Whole Milk 1L (SKU-MLK-002) - 14 units',
        }),
      ).toBeTruthy()
    })

    fireEvent.change(screen.getByLabelText('Source Item'), {
      target: { value: 'item-1002' },
    })
    fireEvent.change(screen.getByLabelText('Destination'), {
      target: { value: 'loc-003' },
    })
    fireEvent.change(screen.getByLabelText('Units'), {
      target: { value: '3' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Transfer Stock' }))

    await waitFor(() => {
      expect(
        screen.getByText('Transferred 3 units to Capitol Hill Store.'),
      ).toBeTruthy()
    })

    fireEvent.change(locationSelect, { target: { value: 'loc-003' } })

    expect(
      screen.getByRole('heading', { name: 'Inventory for Capitol Hill Store' }),
    ).toBeTruthy()

    await waitFor(() => {
      expect(
        screen.getByRole('option', {
          name: 'Whole Milk 1L (SKU-MLK-002) - 3 units',
        }),
      ).toBeTruthy()
    })
  })
})
