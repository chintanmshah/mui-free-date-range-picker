import type { SxProps, Theme } from '@mui/material/styles'
import type { TextFieldProps } from '@mui/material/TextField'
import type { PickerValidDate } from '@mui/x-date-pickers/models'

/** A start/end tuple. Either date may be null while a range is being selected. */
export type DateRange<TDate> = [TDate | null, TDate | null]

/** The part of a range the next calendar selection will fill. */
export type RangeSelectionPhase = 'start' | 'end'

export interface DateRangeAdapter<TDate> {
  isBefore(value: TDate, comparing: TDate): boolean
  isEqual(value: TDate | null, comparing: TDate | null): boolean
}

export interface DateRangeConstraints<TDate> {
  isDateSelectable?: (date: TDate) => boolean
}

/** Field customization points exposed by the picker. */
export interface DateRangePickerSlotProps {
  startField?: Partial<TextFieldProps>
  endField?: Partial<TextFieldProps>
}

/** Props for the adapter-agnostic MUI date-range picker. */
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
  slotProps?: DateRangePickerSlotProps
  sx?: SxProps<Theme>
}
