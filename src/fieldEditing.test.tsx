import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

const referenceDate = new Date(2024, 3, 1)

describe('editable date fields', () => {
  it('accepts typed start and end dates', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker referenceDate={referenceDate} onChange={onChange} />
      </LocalizationProvider>,
    )

    const start = screen.getByLabelText('Start date')
    const end = screen.getByLabelText('End date')
    await user.type(start, '04/10/2024')
    await user.tab()
    await user.type(end, '04/15/2024')
    await user.tab()

    expect(onChange).toHaveBeenLastCalledWith([
      new Date(2024, 3, 10),
      new Date(2024, 3, 15),
    ])
  })

  it('opens the calendar from the field calendar icon', async () => {
    const user = userEvent.setup()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker referenceDate={referenceDate} />
      </LocalizationProvider>,
    )

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])

    expect(screen.getByRole('button', { name: 'Next month' })).toBeInTheDocument()
  })
})
