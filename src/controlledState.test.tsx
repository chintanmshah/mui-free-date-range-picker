import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

it('keeps the parent value authoritative when it does not update', async () => {
  const user = userEvent.setup()
  const onChange = vi.fn()

  render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        value={[null, null]}
        onChange={onChange}
        referenceDate={new Date(2024, 3, 1)}
      />
    </LocalizationProvider>,
  )

  await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
  await user.click(screen.getAllByRole('gridcell', { name: '10' })[0])

  expect(onChange).toHaveBeenCalled()
  expect(screen.getByLabelText('Start date')).toHaveValue('')
})
