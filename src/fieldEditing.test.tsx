import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

const referenceDate = new Date(2024, 3, 1)

async function typeDate(user: ReturnType<typeof userEvent.setup>, label: string, month: string, day: string, year: string) {
  const field = screen.getByRole('group', { name: label })
  const sections = ['Month', 'Day', 'Year']
  const values = [month, day, year]
  for (const [index, section] of sections.entries()) {
    await user.click(within(field).getByRole('spinbutton', { name: section }))
    await user.keyboard(values[index])
  }
}

describe('editable date fields', () => {
  it('accepts typed start and end dates', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker referenceDate={referenceDate} onChange={onChange} />
      </LocalizationProvider>,
    )

    await typeDate(user, 'Start date', '04', '10', '2024')
    await user.tab()
    await typeDate(user, 'End date', '04', '15', '2024')
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

  it('opens on a typed date and shows it selected', async () => {
    const user = userEvent.setup()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker referenceDate={referenceDate} />
      </LocalizationProvider>,
    )

    await typeDate(user, 'Start date', '09', '10', '2024')
    await user.tab()
    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])

    expect(screen.getByTestId('date-range-calendar-left')).toHaveTextContent('September 2024')
    expect(document.querySelector('[data-range-start="true"]')).toBeInTheDocument()
  })

  it('uses DateField validation for dates outside the picker constraints', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          minDate={new Date(2024, 3, 12)}
          onChange={onChange}
          referenceDate={referenceDate}
        />
      </LocalizationProvider>,
    )

    await typeDate(user, 'Start date', '04', '10', '2024')

    expect(screen.getByRole('group', { name: 'Start date' })).toHaveAttribute('aria-invalid', 'true')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('clears only the endpoint cleared from its DateField', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker
          defaultValue={[new Date(2024, 3, 10), new Date(2024, 3, 15)]}
          onChange={onChange}
          referenceDate={referenceDate}
          slotProps={{ startField: { clearable: true } }}
        />
      </LocalizationProvider>,
    )

    await user.click(screen.getByTitle('Clear'))

    expect(onChange).toHaveBeenLastCalledWith([null, new Date(2024, 3, 15)])
  })
})
