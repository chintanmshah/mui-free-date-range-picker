import type { SxProps, Theme } from '@mui/material/styles'

export type DateRange<TDate> = [TDate | null, TDate | null]

export type RangeSelectionPhase = 'start' | 'end'

export interface DateRangeAdapter<TDate> {
  isBefore(value: TDate, comparing: TDate): boolean
  isEqual(value: TDate | null, comparing: TDate | null): boolean
}

export interface DateRangeConstraints<TDate> {
  isDateSelectable?: (date: TDate) => boolean
}

export interface DateRangePickerProps<TDate> {
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
  slotProps?: Record<string, unknown>
  sx?: SxProps<Theme>
}
