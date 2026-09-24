import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

function renderPicker() {
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker referenceDate={new Date(2024, 3, 1)} />
    </LocalizationProvider>,
  )
}

describe('calendar navigation', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('uses the actual current month when no reference date is supplied', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2025, 6, 15))
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker />
      </LocalizationProvider>,
    )

    fireEvent.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])

    expect(screen.getByText('July 2025 / August 2025')).toBeInTheDocument()
  })

  it('shows adjacent months when no range is selected', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
    screen.getByRole('button', { name: 'Previous month' })
    screen.getByRole('button', { name: 'Next month' })
    expect(screen.getAllByText('April 2024')).toHaveLength(1)
    expect(screen.getAllByText('May 2024')).toHaveLength(1)
  })

  it('moves both visible months with one navigation control', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
    await user.click(screen.getByRole('button', { name: 'Next month' }))

    expect(screen.getByText('May 2024 / June 2024')).toBeInTheDocument()
  })
})
