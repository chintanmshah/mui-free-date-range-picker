# mui-free-date-range-picker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and publish a free-MUI date-range picker with a controlled/uncontrolled API, responsive calendar UI, and ESM/CommonJS distribution.

**Architecture:** Keep range selection and validation in a framework-light state module, then compose free MUI X calendar and field primitives in the public picker. Vite remains the demo server; tsup builds the package and Vitest/Testing Library verifies the state and UI contracts.

**Tech Stack:** React 19, TypeScript 6, MUI Material 9, MUI X Date Pickers 9, Emotion, date-fns for the demo adapter, Vite 8, tsup, Vitest 5, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-24-mui-free-date-range-picker-design.md`

## Global Constraints

- Do not depend on `@mui/x-date-pickers-pro` or other paid MUI packages.
- Do not copy proprietary MUI X Pro source code, assets, or implementation details.
- Use free `@mui/material` and `@mui/x-date-pickers` primitives.
- Keep the package adapter-agnostic through MUI's `LocalizationProvider`.
- Publish both ESM and CommonJS builds with declaration files.
- Keep package code, demo code, and tests separated.

## Review Focus

- Reversed start/end clicks must normalize into chronological ranges; test in `src/dateRangeState.test.ts`.
- Partial ranges must remain representable without emitting a false completed range; test in the state module and public picker.
- Disabled, min, and max dates must not complete a range; test the public picker with a fixed adapter date.
- Controlled values must not be overwritten by internal state after parent updates; test `DateRangePicker.test.tsx`.
- Adapter-provided date types must be used for comparisons and formatting; test rendering through `LocalizationProvider` with `AdapterDateFns`.

### Task 1: Package Configuration and Test Harness

**Files:**
- Modify: `package.json`
- Modify: `vite.config.ts`
- Modify: `tsconfig.app.json`
- Create: `vitest.config.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces npm scripts `build:lib`, `test`, `test:watch`, and `lint`.
- Produces Vitest globals with jsdom and Testing Library matchers.

- [ ] **Step 1: Add package scripts and publish metadata**

Set `private` to `false`, keep version `0.1.0`, add `main: dist/index.cjs`, `module: dist/index.js`, `types: dist/index.d.ts`, `files: ["dist"]`, and scripts `build:lib`, `build`, `test`, `test:watch`, and `lint`. Move runtime MUI and React packages into `peerDependencies` while retaining them in `devDependencies` for the demo build.

- [ ] **Step 2: Configure Vitest**

Create `vitest.config.ts` with the React plugin, `environment: "jsdom"`, `globals: true`, and `setupFiles: "./src/test/setup.ts"`. The setup imports `@testing-library/jest-dom/vitest`.

- [ ] **Step 3: Configure tsup and package build**

Add `build:lib` using `tsup src/index.tsx --format esm,cjs --dts --external react,react-dom,@mui/material,@mui/system,@mui/x-date-pickers,@emotion/react,@emotion/styled` and ensure the existing Vite demo build remains available through `build:demo`.

- [ ] **Step 4: Run the harness check**

Run `npm test -- --run`. Expected: Vitest starts successfully and reports no test files yet, with exit code zero or the configured no-tests result accepted by the script.

### Task 2: Range State and Date Contracts

**Files:**
- Create: `src/types.ts`
- Create: `src/dateRangeState.ts`
- Create: `src/dateRangeState.test.ts`

**Interfaces:**
- `DateRange<TDate> = [TDate | null, TDate | null]`.
- `RangeSelectionPhase = "start" | "end"`.
- `createDateRangeState<TDate>(adapter, value, constraints)` returns `{ range, phase, preview, selectDate, previewDate, clear }`.
- `selectDate(date)` returns the next range and phase.

- [ ] **Step 1: Write failing tests for selection behavior**

Cover a first click creating `[start, null]`, a second click creating `[start, end]`, reversed clicks normalizing through `adapter.isBefore`, a new start after a completed range, hover preview, and clear.

- [ ] **Step 2: Run the focused test**

Run `npm test -- --run src/dateRangeState.test.ts`. Expected: FAIL because `src/dateRangeState.ts` does not exist.

- [ ] **Step 3: Implement the minimal state machine**

Use the active adapter methods `isBefore`, `isEqual`, and `isWithinRange` where available; compare only through adapter methods. Reject dates for which the constraints predicate returns false. Preserve partial ranges and make `preview` null unless the phase is `end` and a hover date exists.

- [ ] **Step 4: Run the focused test**

Run `npm test -- --run src/dateRangeState.test.ts`. Expected: PASS.

### Task 3: Public Picker Component

**Files:**
- Create: `src/DateRangePicker.tsx`
- Create: `src/DateRangePicker.test.tsx`
- Modify: `src/types.ts`
- Create: `src/index.tsx`

**Interfaces:**
- `DateRangePickerProps<TDate>` includes `value`, `defaultValue`, `onChange`, `minDate`, `maxDate`, `disablePast`, `disableFuture`, `format`, `disabled`, `readOnly`, `closeOnSelect`, `slotProps`, and `sx`.
- Export `DateRangePicker`, `DateRange`, `DateRangePickerProps`, and `useDateRangeState`.

- [ ] **Step 1: Write failing component tests**

Render with `LocalizationProvider` and `AdapterDateFns`; assert two labeled fields exist, selecting two valid calendar days calls `onChange` with a completed range, a controlled value appears in both fields, and disabled dates do not complete selection.

- [ ] **Step 2: Run the focused test**

Run `npm test -- --run src/DateRangePicker.test.tsx`. Expected: FAIL because the public component is not implemented.

- [ ] **Step 3: Implement fields, popover, and calendar composition**

Use MUI `TextField`, `Popover`, `Box`, `IconButton`, `DateCalendar`, `PickersDay`, and `useMediaQuery`. Render start/end inputs, open the popover from either field, show adjacent month calendars on desktop and one calendar on compact screens, route day clicks through `useDateRangeState`, style in-range and preview days with `sx`, and provide clear/close controls.

- [ ] **Step 4: Add controlled synchronization and validation**

Initialize internal state from `value` or `defaultValue`, synchronize when `value` changes, format fields through the active adapter, and expose `aria-invalid` plus helper text when constraints reject the current value.

- [ ] **Step 5: Run the focused test**

Run `npm test -- --run src/DateRangePicker.test.tsx`. Expected: PASS.

### Task 4: Demo and Documentation

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/index.css`
- Modify: `README.md`
- Modify: `index.html`

**Interfaces:**
- The demo imports the package source entry and shows controlled and uncontrolled examples.

- [ ] **Step 1: Replace the Vite starter UI**

Create a focused demo with `LocalizationProvider` and `AdapterDateFns`, a themed picker, selected-range output, and a responsive layout that visually demonstrates the dual-calendar desktop experience.

- [ ] **Step 2: Document installation and usage**

Document `npm install mui-free-date-range-picker @mui/material @mui/x-date-pickers @emotion/react @emotion/styled date-fns`, provider setup, controlled usage, peer requirements, and known differences from MUI X Pro. Add an explicit note that the implementation is original and uses free MUI APIs.

- [ ] **Step 3: Run the demo build**

Run `npm run build:demo`. Expected: Vite emits a production build without TypeScript or bundler errors.

### Task 5: Distribution Build and Acceptance Tests

**Files:**
- Modify: `tsconfig.app.json`
- Modify: `README.md`
- Create: `src/index.test.tsx`

**Interfaces:**
- `dist/index.js`, `dist/index.cjs`, and `dist/index.d.ts` are the publishable outputs.

- [ ] **Step 1: Add public export tests**

Assert that `DateRangePicker` and `useDateRangeState` are available from `src/index.tsx` and that a consumer can render the exported picker with the documented provider setup.

- [ ] **Step 2: Run the full test suite**

Run `npm test -- --run`. Expected: all state, component, and export tests pass.

- [ ] **Step 3: Build the package**

Run `npm run build:lib`. Expected: ESM, CommonJS, and declaration files are emitted in `dist` with peer dependencies externalized.

- [ ] **Step 4: Run lint and demo build**

Run `npm run lint && npm run build:demo`. Expected: both commands complete without errors.

- [ ] **Step 5: Verify package contents**

Run `npm pack --dry-run`. Expected: the tarball includes only package metadata and `dist` output, with no `src`, `node_modules`, or demo-only files.
