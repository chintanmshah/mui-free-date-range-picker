import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

const referenceDate = new Date(2024, 3, 1)

function renderPicker(value?: [Date | null, Date | null]) {
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker referenceDate={referenceDate} value={value} />
    </LocalizationProvider>,
  )
}

describe('range calendar visuals', () => {
  it('marks a hovered end date as a preview segment', async () => {
    const user = userEvent.setup()
    renderPicker([new Date(2024, 3, 10), null])

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
    await user.hover(screen.getAllByRole('gridcell', { name: '15' })[0])

    expect(document.querySelector('[data-range-preview="true"]')).toBeInTheDocument()
  })

  it('marks dates inside a completed range as selected', async () => {
    const user = userEvent.setup()
    renderPicker([new Date(2024, 3, 10), new Date(2024, 3, 15)])

    await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])

    expect(document.querySelector('[data-range-selected="true"]')).toBeInTheDocument()
    expect(document.querySelector('[data-range-start="true"]')).toBeInTheDocument()
    expect(document.querySelector('[data-range-end="true"]')).toBeInTheDocument()
  })
})
