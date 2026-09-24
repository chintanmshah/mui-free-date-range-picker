import type {
  DateRange,
  DateRangeAdapter,
  DateRangeConstraints,
  RangeSelectionPhase,
} from './types'

export interface DateRangeState<TDate> {
  readonly range: DateRange<TDate>
  readonly phase: RangeSelectionPhase
  readonly preview: DateRange<TDate> | null
  selectDate(date: TDate): { range: DateRange<TDate>; phase: RangeSelectionPhase }
  previewDate(date: TDate): DateRange<TDate> | null
  clear(): void
}

export function createDateRangeState<TDate>(
  adapter: DateRangeAdapter<TDate>,
  value: DateRange<TDate> = [null, null],
  constraints: DateRangeConstraints<TDate> = {},
): DateRangeState<TDate> {
  let range: DateRange<TDate> = value
  let phase: RangeSelectionPhase = range[0] !== null && range[1] === null ? 'end' : 'start'
  let preview: DateRange<TDate> | null = null

  const isSelectable = (date: TDate) => constraints.isDateSelectable?.(date) ?? true
  const orderedRange = (first: TDate, second: TDate): DateRange<TDate> =>
    adapter.isBefore(second, first) ? [second, first] : [first, second]

  return {
    get range() {
      return range
    },
    get phase() {
      return phase
    },
    get preview() {
      return preview
    },
    selectDate(date) {
      if (!isSelectable(date)) {
        return { range, phase }
      }

      preview = null
      if (phase === 'start' || range[0] === null) {
        range = [date, null]
        phase = 'end'
        return { range, phase }
      }

      const start = range[0]
      if (start !== null && !isSelectable(start)) {
        return { range, phase }
      }

      range = orderedRange(start, date)
      phase = 'start'
      return { range, phase }
    },
    previewDate(date) {
      if (phase !== 'end' || range[0] === null || !isSelectable(date)) {
        preview = null
        return preview
      }

      preview = orderedRange(range[0], date)
      return preview
    },
    clear() {
      range = [null, null]
      phase = 'start'
      preview = null
    },
  }
}
