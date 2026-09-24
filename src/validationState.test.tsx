import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen } from '@testing-library/react'
import { it, expect } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

it('marks a controlled range invalid when it violates the date constraints', () => {
  render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        value={[new Date(2024, 3, 10), new Date(2024, 3, 15)]}
        minDate={new Date(2024, 3, 12)}
      />
    </LocalizationProvider>,
  )

  expect(screen.getByLabelText('Start date')).toHaveAttribute('aria-invalid', 'true')
})
