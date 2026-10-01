import {
  Box,
  IconButton,
  Popover,
  Typography,
  useMediaQuery,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import InputAdornment from '@mui/material/InputAdornment'
import type { PickerValidDate } from '@mui/x-date-pickers/models'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import { DateField } from '@mui/x-date-pickers/DateField'
import { useLocalizationContext } from '@mui/x-date-pickers/internals'
import type { SxProps, Theme } from '@mui/material/styles'
import { useEffect, useRef, useState } from 'react'
import { createDateRangeState } from './dateRangeState'
import type { DateRange, DateRangePickerProps } from './types'

/** A free-MUI date-range picker with adapter-aware fields and dual calendars. */
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
  const initialRange = value ?? defaultValue
  const [range, setRange] = useState<DateRange<PickerValidDate>>(initialRange)
  const [fieldRange, setFieldRange] = useState<DateRange<PickerValidDate>>(initialRange)
  const [previousValue, setPreviousValue] = useState(value)
  const [activeMonth, setActiveMonth] = useState<PickerValidDate>(() =>
    utils.startOfMonth(referenceDate ?? utils.date()),
  )
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [, setHoverDate] = useState<PickerValidDate | null>(null)
  const stateRef = useRef(
    createDateRangeState<PickerValidDate>(utils, value ?? defaultValue, {
      isDateSelectable: (date) => isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture),
    }),
  )

  if (value !== undefined && value !== previousValue) {
    setPreviousValue(value)
    setFieldRange(value)
  }

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
  const startFieldProps = slotProps?.startField
  const endFieldProps = slotProps?.endField

  const handleDateSelect = (date: PickerValidDate) => {
    const result = stateRef.current.selectDate(date)
    setHoverDate(null)
    if (value === undefined) {
      setRange(result.range)
      setFieldRange(result.range)
    }
    onChange?.(result.range)
    if (result.phase === 'start' && closeOnSelect) {
      setOpen(false)
    }
  }

  const handleOpen = (field: 'start' | 'end', event: React.MouseEvent<HTMLElement>) => {
    if (!disabled && !readOnly) {
      const fieldDate = displayedRange[field === 'start' ? 0 : 1]
      const otherDate = displayedRange[field === 'start' ? 1 : 0]
      setActiveMonth(utils.startOfMonth(fieldDate ?? otherDate ?? referenceDate ?? utils.date()))
      setAnchorEl(event.currentTarget)
      setOpen(true)
    }
  }

  const handleClear = () => {
    stateRef.current.clear()
    const nextRange: DateRange<PickerValidDate> = [null, null]
    if (value === undefined) {
      setRange(nextRange)
      setFieldRange(nextRange)
    }
    onChange?.(nextRange)
  }

  const handleFieldChange = (field: 'start' | 'end', date: PickerValidDate | null, validationError: string | null) => {
    if (validationError !== null) {
      if (date !== null) {
        setFieldRange((current) => field === 'start'
          ? [date, current[1]]
          : [current[0], date])
      }
      return
    }

    const nextStart = field === 'start' ? date : displayedRange[0]
    const nextEnd = field === 'end' ? date : displayedRange[1]
    const nextRange: DateRange<PickerValidDate> = nextStart !== null && nextEnd !== null
      && utils.isBefore(nextEnd, nextStart)
      ? [nextEnd, nextStart]
      : [nextStart, nextEnd]
    if (value === undefined) {
      stateRef.current = createDateRangeState(utils, nextRange, {
        isDateSelectable: (date) => isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture),
      })
      setRange(nextRange)
      setFieldRange(nextRange)
    } else {
      setFieldRange(displayedRange)
    }
    onChange?.(nextRange)
  }

  const getDaySlotProps = (day: PickerValidDate): DaySlotProps => {
    const preview = stateRef.current.preview
    const visibleRange = preview ?? displayedRange
    const isInRange = visibleRange[0] !== null && visibleRange[1] !== null
      && !utils.isBefore(day, visibleRange[0])
      && !utils.isBefore(visibleRange[1], day)
    const isEdge = (visibleRange[0] !== null && utils.isEqual(day, visibleRange[0]))
      || (visibleRange[1] !== null && utils.isEqual(day, visibleRange[1]))
    const isStart = visibleRange[0] !== null && utils.isEqual(day, visibleRange[0])
    const isEnd = visibleRange[1] !== null && utils.isEqual(day, visibleRange[1])
    const isPreview = preview !== null && isInRange && !isEdge
    const isSelected = preview === null && (isInRange || isEdge)
    const rangeRadius = isStart && isEnd
      ? '50%'
      : isStart
        ? '50% 0 0 50%'
        : isEnd
          ? '0 50% 50% 0'
          : 0

    return {
      onMouseEnter: (_event: React.MouseEvent<HTMLElement>) => {
        if (stateRef.current.phase === 'end') {
          stateRef.current.previewDate(day)
          setHoverDate(day)
        }
      },
      'data-range-preview': isPreview || undefined,
      'data-range-selected': isSelected || undefined,
      'data-range-start': isSelected && isStart || undefined,
      'data-range-end': isSelected && isEnd || undefined,
      sx: {
        ...(isPreview ? {
          position: 'relative',
          zIndex: 0,
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: '2px 0',
            margin: '-2px',
            zIndex: -1,
            backgroundColor: 'primary.main',
            opacity: 0.16,
            borderTop: '1px dashed',
            borderBottom: '1px dashed',
            borderColor: 'primary.main',
            borderRadius: rangeRadius,
          },
        } : {}),
        ...(isSelected ? {
          position: 'relative',
          zIndex: 0,
          color: 'primary.contrastText',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            margin: '-4px',
            zIndex: -1,
            backgroundColor: 'primary.main',
            borderRadius: rangeRadius,
          },
        } : {}),
      },
    }
  }

  const nextMonth = utils.addMonths(activeMonth, 1)
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, ...sx }}>
      <DateField
        {...startFieldProps}
        label="Start date"
        value={fieldRange[0]}
        onChange={(date, context) => handleFieldChange('start', date, context.validationError)}
        format={fieldFormat}
        minDate={minDate}
        maxDate={maxDate}
        disablePast={disablePast}
        disableFuture={disableFuture}
        disabled={disabled}
        readOnly={readOnly}
        endAdornment={
          <>
            {startFieldProps?.endAdornment}
            <InputAdornment position="end">
              <IconButton aria-label="Open calendar" onClick={(event) => handleOpen('start', event)} edge="end">
                <CalendarMonthIcon />
              </IconButton>
            </InputAdornment>
          </>
        }
      />
      <Typography sx={{ pt: 2 }} aria-hidden="true">to</Typography>
      <DateField
        {...endFieldProps}
        label="End date"
        value={fieldRange[1]}
        onChange={(date, context) => handleFieldChange('end', date, context.validationError)}
        format={fieldFormat}
        minDate={minDate}
        maxDate={maxDate}
        disablePast={disablePast}
        disableFuture={disableFuture}
        disabled={disabled}
        readOnly={readOnly}
        endAdornment={
          <>
            {endFieldProps?.endAdornment}
            <InputAdornment position="end">
              <IconButton aria-label="Open calendar" onClick={(event) => handleOpen('end', event)} edge="end">
                <CalendarMonthIcon />
              </IconButton>
            </InputAdornment>
          </>
        }
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
          <CalendarSegment
            testId="date-range-calendar-left"
            side="left"
            month={activeMonth}
            utils={utils}
            onNavigate={() => setActiveMonth(utils.addMonths(activeMonth, -1))}
            onChange={handleDateSelect}
            minDate={minDate}
            maxDate={maxDate}
            disablePast={disablePast}
            disableFuture={disableFuture}
            shouldDisableDate={(date) => !isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture)}
            getDaySlotProps={getDaySlotProps}
          />
          {!compact && (
            <Box data-testid="date-range-month-divider" sx={{ borderLeft: 1, borderColor: 'divider', mx: 1 }}>
              <CalendarSegment
                testId="date-range-calendar-right"
                side="right"
                month={nextMonth}
                utils={utils}
                onNavigate={() => setActiveMonth(utils.addMonths(activeMonth, 1))}
                onChange={handleDateSelect}
                minDate={minDate}
                maxDate={maxDate}
                disablePast={disablePast}
                disableFuture={disableFuture}
                shouldDisableDate={(date) => !isSelectable(date, utils, minDate, maxDate, disablePast, disableFuture)}
                getDaySlotProps={getDaySlotProps}
              />
            </Box>
          )}
        </Box>
      </Popover>
    </Box>
  )
}

type PickerAdapter = ReturnType<typeof useLocalizationContext>['adapter']

interface DaySlotProps {
  onMouseEnter: (event: React.MouseEvent<HTMLElement>) => void
  'data-range-preview'?: boolean
  'data-range-selected'?: boolean
  'data-range-start'?: boolean
  'data-range-end'?: boolean
  sx: SxProps<Theme>
}

interface CalendarSegmentProps {
  testId: string
  side: 'left' | 'right'
  month: PickerValidDate
  utils: PickerAdapter
  onNavigate: () => void
  onChange: (date: PickerValidDate) => void
  minDate?: PickerValidDate
  maxDate?: PickerValidDate
  disablePast: boolean
  disableFuture: boolean
  shouldDisableDate: (date: PickerValidDate) => boolean
  getDaySlotProps: (day: PickerValidDate) => DaySlotProps
}

function CalendarSegment({
  testId,
  side,
  month,
  utils,
  onNavigate,
  onChange,
  minDate,
  maxDate,
  disablePast,
  disableFuture,
  shouldDisableDate,
  getDaySlotProps,
}: CalendarSegmentProps) {
  const isLeft = side === 'left'

  return (
    <Box data-testid={testId} sx={{ flex: 1, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1 }}>
        {isLeft ? (
          <IconButton aria-label="Previous month" onClick={onNavigate}>
            <ChevronLeftIcon />
          </IconButton>
        ) : <Box sx={{ width: 40 }} />}
        <Typography variant="subtitle1" sx={{ flex: 1, textAlign: 'center' }}>
          {formatMonthYear(utils, month)}
        </Typography>
        {isLeft ? (
          <Box sx={{ width: 40 }} />
        ) : (
          <IconButton aria-label="Next month" onClick={onNavigate}>
            <ChevronRightIcon />
          </IconButton>
        )}
      </Box>
      <DateCalendar
        key={`${side}-${formatMonthYear(utils, month)}`}
        value={null}
        referenceDate={month}
        onChange={(date) => date !== null && onChange(date)}
        minDate={minDate}
        maxDate={maxDate}
        disablePast={disablePast}
        disableFuture={disableFuture}
        shouldDisableDate={shouldDisableDate}
        slotProps={{ day: (ownerState) => getDaySlotProps(ownerState.day) }}
        sx={{ '& .MuiPickersCalendarHeader-root': { display: 'none' } }}
      />
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

function formatMonthYear(
  utils: ReturnType<typeof useLocalizationContext>['adapter'],
  date: PickerValidDate,
) {
  return `${utils.format(date, 'month')} ${utils.format(date, 'year')}`
}
