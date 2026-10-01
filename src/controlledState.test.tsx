import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { DateRangePicker } from './DateRangePicker'

async function typeDate(user: ReturnType<typeof userEvent.setup>, label: string, month: string, day: string, year: string) {
  const field = screen.getByRole('group', { name: label })
  const sections = ['Month', 'Day', 'Year']
  const values = [month, day, year]
  for (const [index, section] of sections.entries()) {
    await user.click(within(field).getByRole('spinbutton', { name: section }))
    await user.keyboard(values[index])
  }
}

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
  expect(screen.getByRole('group', { name: 'Start date', hidden: true })).toHaveTextContent('MM/DD/YYYY')
})

it('keeps typed dates out of calendar state when the parent value does not update', async () => {
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

  await typeDate(user, 'Start date', '04', '10', '2024')
  onChange.mockClear()
  await user.click(screen.getAllByRole('button', { name: 'Open calendar' })[0])
  await user.click(screen.getAllByRole('gridcell', { name: '15' })[0])

  expect(onChange).toHaveBeenLastCalledWith([new Date(2024, 3, 15), null])
})
