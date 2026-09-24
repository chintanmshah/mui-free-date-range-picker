import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { fireEvent, render, screen, within } from '@testing-library/react'
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

    expect(screen.getByTestId('date-range-calendar-left')).toHaveTextContent('July 2025')
    expect(screen.getByTestId('date-range-calendar-right')).toHaveTextContent('August 2025')
  })

  it('shows adjacent months when no range is selected', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
    const leftCalendar = screen.getByTestId('date-range-calendar-left')
    const rightCalendar = screen.getByTestId('date-range-calendar-right')
    expect(leftCalendar).toContainElement(screen.getByRole('button', { name: 'Previous month' }))
    expect(rightCalendar).toContainElement(screen.getByRole('button', { name: 'Next month' }))
    expect(leftCalendar).toHaveTextContent('April 2024')
    expect(rightCalendar).toHaveTextContent('May 2024')
    expect(screen.getByTestId('date-range-month-divider')).toBeInTheDocument()
  })

  it('moves both visible months with one navigation control', async () => {
    const user = userEvent.setup()
    renderPicker()

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
    await user.click(screen.getByRole('button', { name: 'Next month' }))

    expect(screen.getByTestId('date-range-calendar-left')).toHaveTextContent('May 2024')
    expect(screen.getByTestId('date-range-calendar-right')).toHaveTextContent('June 2024')
  })

  it('changes the actual calendar grid when moving across month lengths', async () => {
    const user = userEvent.setup()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker referenceDate={new Date(2025, 0, 1)} />
      </LocalizationProvider>,
    )

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
    expect(within(screen.getAllByRole('grid')[0]).getByRole('gridcell', { name: '31' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Next month' }))

    expect(within(screen.getAllByRole('grid')[0]).queryByRole('gridcell', { name: '31' })).not.toBeInTheDocument()
  })
})
