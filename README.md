# mui-free-date-range-picker

A date-range picker composed from free MUI and MUI X date-picker primitives. It provides a controlled or uncontrolled range API without depending on `@mui/x-date-pickers-pro`.

## Install

```bash
npm install mui-free-date-range-picker @mui/material @mui/x-date-pickers @emotion/react @emotion/styled date-fns
```

## Usage

Wrap the picker in MUI's `LocalizationProvider` and choose the adapter for your date library:

```tsx
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateRangePicker } from 'mui-free-date-range-picker'

export function BookingDates() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateRangePicker
        defaultValue={[new Date(2025, 5, 12), new Date(2025, 5, 18)]}
        onChange={(nextRange) => console.log(nextRange)}
      />
    </LocalizationProvider>
  )
}
```

## Controlled values

`value` is a two-item tuple: `[start, end]`. Either item may be `null` while a range is being selected.

```tsx
const [value, setValue] = useState<[Date | null, Date | null]>([null, null])

<DateRangePicker value={value} onChange={setValue} minDate={new Date()} />
```

Supported options include `minDate`, `maxDate`, `disablePast`, `disableFuture`, `format`, `disabled`, `readOnly`, `closeOnSelect`, `slotProps`, and `sx`.

## Peer dependencies

React, React DOM, Emotion, Material UI, and MUI X Date Pickers are peer dependencies of the published package. The package is adapter-agnostic and uses the active `LocalizationProvider` adapter for date comparisons and formatting.

## Development

```bash
npm install
npm run dev
npm test -- --run
npm run build
```

The Vite demo uses `AdapterDateFns`; the package itself does not hard-code a date library. The implementation is original and uses public free MUI APIs. It is not a copy of MUI X Pro source code and does not provide MUI X Pro's commercial-only APIs.

## Credits and attribution

This package is an original implementation built with open-source projects:

- [React](https://react.dev/) and [React DOM](https://react.dev/)
- [Material UI](https://mui.com/material-ui/) and [MUI X Date Pickers](https://mui.com/x/react-date-pickers/)
- [Emotion](https://emotion.sh/)
- [date-fns](https://date-fns.org/) for the demo adapter
- [Vite](https://vite.dev/), [Vitest](https://vitest.dev/), and [Testing Library](https://testing-library.com/) for development and testing

Those projects retain their own licenses. This package is distributed under the MIT License. No source code or assets from MUI X Pro are included.
