import {
  Box,
  IconButton,
  Popover,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import type { PickerValidDate } from '@mui/x-date-pickers/models'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { useLocalizationContext } from '@mui/x-date-pickers/internals'
import { useEffect, useRef, useState } from 'react'
import { createDateRangeState } from './dateRangeState'
import type { DateRange, DateRangePickerProps } from './types'

const defaultFormat = 'MM/dd/yyyy'

export function DateRangePicker({
  value,
  defaultValue = [null, null],
  onChange,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  format = defaultFormat,
  disabled = false,
  readOnly = false,
  closeOnSelect = true,
  referenceDate,
  sx,
}: DateRangePickerProps<PickerValidDate>) {
  const utils = useLocalizationContext().adapter
  const compact = useMediaQuery('(max-width: 600px)')
  const [range, setRange] = useState<DateRange<PickerValidDate>>(value ?? defaultValue)
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const stateRef = useRef(
    createDateRangeState<PickerValidDate>(utils, value ?? defaultValue, {
      isDateSelectable: (date) => isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture),
    }),
  )

  useEffect(() => {
    if (value === undefined) {
      return
    }

    stateRef.current = createDateRangeState(utils, value, {
      isDateSelectable: (date) => isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture),
    })
    setRange(value)
  }, [disableFuture, disablePast, maxDate, minDate, utils, value])

  const displayValue = (date: PickerValidDate | null) =>
    date === null ? '' : utils.formatByString(date, format)

  const handleDateSelect = (date: PickerValidDate) => {
    const result = stateRef.current.selectDate(date)
    setRange(result.range)
    onChange?.(result.range)
    if (result.phase === 'start' && closeOnSelect) {
      setOpen(false)
    }
  }

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !readOnly) {
      setAnchorEl(event.currentTarget)
      setOpen(true)
    }
  }

  const handleClear = () => {
    stateRef.current.clear()
    const nextRange: DateRange<PickerValidDate> = [null, null]
    setRange(nextRange)
    onChange?.(nextRange)
  }

  const calendarReferenceDate = referenceDate ?? utils.date()
  const nextMonth = utils.addMonths(calendarReferenceDate, 1)

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, ...sx }}>
      <TextField
        label="Start date"
        value={displayValue(range[0])}
        onClick={handleOpen}
        disabled={disabled}
        slotProps={{ input: { readOnly: true, 'aria-label': 'Start date' } }}
      />
      <Typography sx={{ pt: 2 }} aria-hidden="true">to</Typography>
      <TextField
        label="End date"
        value={displayValue(range[1])}
        onClick={handleOpen}
        disabled={disabled}
        slotProps={{ input: { readOnly: true, 'aria-label': 'End date' } }}
      />
      <IconButton aria-label="Clear date range" onClick={handleClear} disabled={disabled || readOnly}>
        ×
      </IconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ display: 'flex', p: 1 }}>
          <DateCalendar
            value={range[0]}
            referenceDate={calendarReferenceDate}
            onChange={(date) => date !== null && handleDateSelect(date)}
            minDate={minDate}
            maxDate={maxDate}
            disablePast={disablePast}
            disableFuture={disableFuture}
            shouldDisableDate={(date) => !isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture)}
          />
          {!compact && (
            <DateCalendar
              value={range[1]}
              referenceDate={nextMonth}
              onChange={(date) => date !== null && handleDateSelect(date)}
              minDate={minDate}
              maxDate={maxDate}
              disablePast={disablePast}
              disableFuture={disableFuture}
              shouldDisableDate={(date) => !isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture)}
            />
          )}
        </Box>
      </Popover>
    </Box>
  )
}

function isSelectable(
  date: PickerValidDate,
  utils: ReturnType<typeof useLocalizationContext>['adapter'],
  minDate?: PickerValidDate,
  maxDate?: PickerValidDate,
  disablePast = false,
  disableFuture = false,
) {
  const today = utils.date()
  return !(
    (minDate !== undefined && utils.isBefore(date, minDate))
    || (maxDate !== undefined && utils.isBefore(maxDate, date))
    || (disablePast && utils.isBefore(date, today))
    || (disableFuture && utils.isBefore(today, date))
  )
}
