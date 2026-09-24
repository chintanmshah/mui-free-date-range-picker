import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { createDateRangeState, DateRangePicker } from './index'

const adapter = {
  isBefore: (left: number, right: number) => left < right,
  isEqual: (left: number, right: number) => left === right,
}

describe('package entrypoint', () => {
  it('exports the picker and state factory', () => {
    expect(DateRangePicker).toBeDefined()
    expect(createDateRangeState(adapter, [null, null]).phase).toBe('start')
  })

  it('renders the documented provider setup', () => {
    render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DateRangePicker referenceDate={new Date(2024, 3, 1)} />
      </LocalizationProvider>,
    )

    expect(screen.getByLabelText('Start date')).toBeInTheDocument()
  })
})
