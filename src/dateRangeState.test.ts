import { describe, expect, it } from 'vitest'
import { createDateRangeState } from './dateRangeState'

const adapter = {
  isBefore: (left: number, right: number) => left < right,
  isEqual: (left: number, right: number) => left === right,
}

describe('createDateRangeState', () => {
  it('starts a partial range and completes it with the second date', () => {
    const state = createDateRangeState(adapter, [null, null])

    expect(state.selectDate(10)).toEqual({ range: [10, null], phase: 'end' })
    expect(state.selectDate(15)).toEqual({ range: [10, 15], phase: 'start' })
    expect(state.range).toEqual([10, 15])
  })

  it('normalizes reversed selections into chronological order', () => {
    const state = createDateRangeState(adapter, [null, null])

    state.selectDate(15)
    const result = state.selectDate(10)

    expect(result.range).toEqual([10, 15])
  })

  it('starts a new range after a completed range', () => {
    const state = createDateRangeState(adapter, [10, 15])

    expect(state.selectDate(20)).toEqual({ range: [20, null], phase: 'end' })
  })

  it('previews a range while selecting the end date', () => {
    const state = createDateRangeState(adapter, [10, null])

    expect(state.previewDate(15)).toEqual([10, 15])
    expect(state.preview).toEqual([10, 15])
    expect(state.previewDate(5)).toEqual([5, 10])
  })

  it('rejects dates that fail the selectable constraint', () => {
    const state = createDateRangeState(adapter, [null, null], {
      isDateSelectable: (date) => date !== 12,
    })

    expect(state.selectDate(12)).toEqual({ range: [null, null], phase: 'start' })
  })

  it('clears the range and resets the phase', () => {
    const state = createDateRangeState(adapter, [10, 15])

    state.clear()

    expect(state.range).toEqual([null, null])
    expect(state.phase).toBe('start')
    expect(state.preview).toBeNull()
  })
})
