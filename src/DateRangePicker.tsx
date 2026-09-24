import {
  Box,
  IconButton,
  Popover,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import type { PickerValidDate } from '@mui/x-date-pickers/models'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { useLocalizationContext } from '@mui/x-date-pickers/internals'
import { useEffect, useRef, useState } from 'react'
import { createDateRangeState } from './dateRangeState'
import type { DateRange, DateRangePickerProps } from './types'

export function DateRangePicker({
  value,
  defaultValue = [null, null],
  onChange,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  format,
  disabled = false,
  readOnly = false,
  closeOnSelect = true,
  referenceDate,
  slotProps,
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
  }, [disableFuture, disablePast, maxDate, minDate, utils, value])

  const displayedRange = value ?? range
  const fieldFormat = format ?? utils.formats.keyboardDate
  const startFieldProps = slotProps?.startField as Partial<TextFieldProps> | undefined
  const endFieldProps = slotProps?.endField as Partial<TextFieldProps> | undefined
  const displayValue = (date: PickerValidDate | null) =>
    date === null ? '' : utils.formatByString(date, fieldFormat)

  const handleDateSelect = (date: PickerValidDate) => {
    const result = stateRef.current.selectDate(date)
    if (value === undefined) {
      setRange(result.range)
    }
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
    if (value === undefined) {
      setRange(nextRange)
    }
    onChange?.(nextRange)
  }

  const calendarReferenceDate = referenceDate ?? utils.date()
  const nextMonth = utils.addMonths(calendarReferenceDate, 1)
  const hasInvalidDate = displayedRange.some(
    (date) => date !== null && !isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture),
  )

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, ...sx }}>
      <TextField
        {...startFieldProps}
        label="Start date"
        value={displayValue(displayedRange[0])}
        onClick={handleOpen}
        disabled={disabled}
        error={hasInvalidDate}
        helperText={hasInvalidDate ? 'Select valid dates' : undefined}
        slotProps={{ input: { readOnly: true, 'aria-label': 'Start date' } }}
      />
      <Typography sx={{ pt: 2 }} aria-hidden="true">to</Typography>
      <TextField
        {...endFieldProps}
        label="End date"
        value={displayValue(displayedRange[1])}
        onClick={handleOpen}
        disabled={disabled}
        error={hasInvalidDate}
        helperText={hasInvalidDate ? 'Select valid dates' : undefined}
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
            value={displayedRange[0]}
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
              value={displayedRange[1]}
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
