# mui-free-date-range-picker Design

## Goal

Publish `mui-free-date-range-picker`, an original React and TypeScript component that provides a date-range picker experience closely matching the public behavior and visual language of MUI X's date-range picker while using free MUI packages only.

## Constraints

- Do not depend on `@mui/x-date-pickers-pro` or other paid MUI packages.
- Do not copy proprietary MUI X Pro source code, assets, or implementation details.
- Use free `@mui/material` and `@mui/x-date-pickers` primitives.
- Keep the package adapter-agnostic through MUI's `LocalizationProvider`.
- Publish both ESM and CommonJS builds with declaration files.

## Architecture

The package will expose a public `DateRangePicker` component and a small range model:

- `DateRangePicker`: public controlled/uncontrolled component, field layout, calendar popover, responsive presentation, and slots/styles.
- `useDateRangeState`: internal range-selection state machine for start/end phases, hover preview, validation, and commit behavior.
- Calendar presentation: composes free MUI `DateCalendar` and picker primitives while coordinating two visible months and range highlighting.
- Field presentation: uses MUI field primitives for start/end inputs and forwards standard disabled, read-only, validation, and focus behavior.
- Date operations: use the active MUI adapter from `LocalizationProvider`; no hard-coded `date-fns` logic in the package runtime.

The demo will wrap the component in `LocalizationProvider` with `AdapterDateFns` and demonstrate controlled values, theming, responsive layout, and validation.

## Public API

The first release will support:

- `value`, `defaultValue`, and `onChange`
- `minDate`, `maxDate`, `disablePast`, and `disableFuture`
- `format`, `disabled`, `readOnly`, and `closeOnSelect`
- `slotProps` and `sx` for MUI-consistent customization
- `DateRange` and exported component prop types

The API will prefer native JavaScript `Date` values to remain compatible with the active MUI adapter and avoid introducing a second date abstraction.

## Interaction Behavior

- Clicking a day starts a range or replaces the existing range.
- Clicking a second valid day completes the range, normalizing reversed selections.
- Hovering while selecting previews the complete range.
- Start and end fields remain synchronized with calendar selection.
- Invalid dates cannot complete a range and expose MUI-compatible validation state.
- Keyboard focus and escape/enter behavior follow the underlying MUI picker conventions.
- The desktop layout shows two adjacent months; the compact layout uses a single calendar with responsive field controls.

## Build and Tooling

- Vite powers the demo and development server.
- `tsup` emits ESM and CommonJS package bundles.
- `vite-plugin-dts` or the TypeScript build emits declarations.
- Vitest with Testing Library covers range selection, controlled updates, validation, keyboard interactions, and responsive presentation.
- MUI, React, and date adapter packages remain peer dependencies in the published package; demo-only dependencies stay in development dependencies.

## Testing Strategy

Unit and interaction tests will verify the range state machine independently where practical, then exercise the public component through Testing Library. The initial acceptance checks are selecting a range, reversing a range, hovering a preview, controlled updates, disabled dates, min/max validation, clear/escape behavior, and rendering within a MUI theme and localization provider.

## Licensing and Documentation

The repository will use an open-source license selected by the package owner before publishing. The README will document installation, peer dependencies, provider setup, basic usage, controlled usage, theming, and known differences from MUI X Pro. The implementation will reference public MUI APIs and behavior without copying premium source code.
