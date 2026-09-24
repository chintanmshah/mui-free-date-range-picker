import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

const referenceDate = new Date(2024, 3, 1)

function renderPicker(props: React.ComponentProps<typeof DateRangePicker> = {}) {
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker referenceDate={referenceDate} {...props} />
    </LocalizationProvider>,
  )
}

describe('DateRangePicker', () => {
  it('renders start and end fields', () => {
    renderPicker()

    expect(screen.getByLabelText('Start date')).toBeInTheDocument()
    expect(screen.getByLabelText('End date')).toBeInTheDocument()
  })

  it('emits a completed range after two calendar selections', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderPicker({ onChange })

    await user.click(screen.getByLabelText('Start date'))
    await user.click(screen.getAllByRole('gridcell', { name: '10' })[0])
    await user.click(screen.getAllByRole('gridcell', { name: '15' })[0])

    expect(onChange).toHaveBeenLastCalledWith([
      new Date(2024, 3, 10),
      new Date(2024, 3, 15),
    ])
  })

  it('renders controlled values in both fields', () => {
    renderPicker({
      value: [new Date(2024, 3, 10), new Date(2024, 3, 15)],
    })

    expect(screen.getByLabelText('Start date')).toHaveValue('04/10/2024')
    expect(screen.getByLabelText('End date')).toHaveValue('04/15/2024')
  })

  it('does not complete a range with a disabled date', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    renderPicker({ onChange, minDate: new Date(2024, 3, 12) })

    await user.click(screen.getByLabelText('Start date'))
    expect(screen.getAllByRole('gridcell', { name: '10' })[0]).toBeDisabled()

    expect(onChange).not.toHaveBeenCalledWith([
      new Date(2024, 3, 10),
      new Date(2024, 3, 15),
    ])
  })
})
