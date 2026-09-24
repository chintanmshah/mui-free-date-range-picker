import type { SxProps, Theme } from '@mui/material/styles'
import type { PickerValidDate } from '@mui/x-date-pickers/models'

export type DateRange<TDate> = [TDate | null, TDate | null]

export type RangeSelectionPhase = 'start' | 'end'

export interface DateRangeAdapter<TDate> {
  isBefore(value: TDate, comparing: TDate): boolean
  isEqual(value: TDate | null, comparing: TDate | null): boolean
}

export interface DateRangeConstraints<TDate> {
  isDateSelectable?: (date: TDate) => boolean
}

export interface DateRangePickerProps<TDate = PickerValidDate> {
  value?: DateRange<TDate>
  defaultValue?: DateRange<TDate>
  onChange?: (value: DateRange<TDate>) => void
  minDate?: TDate
  maxDate?: TDate
  disablePast?: boolean
  disableFuture?: boolean
  format?: string
  disabled?: boolean
  readOnly?: boolean
  closeOnSelect?: boolean
  referenceDate?: TDate
  slotProps?: Record<string, unknown>
  sx?: SxProps<Theme>
}
