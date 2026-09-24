import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useState } from 'react'
import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from './types'
import './App.css'

const theme = createTheme({
  palette: {
    background: { default: '#f4efe5', paper: '#fffdf8' },
    text: { primary: '#233332', secondary: '#64716c' },
  },
  shape: { borderRadius: 10 },
  typography: { fontFamily: 'Avenir Next, Helvetica Neue, sans-serif' },
})

function App() {
  const [value, setValue] = useState<DateRange<Date>>([null, null])
  const formattedRange = value[0] && value[1]
    ? `${value[0].toLocaleDateString()} - ${value[1].toLocaleDateString()}`
    : 'Choose a start and end date'

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <main className="demo-shell">
          <header className="demo-header">
            <span className="eyebrow">Free MUI primitive</span>
            <h1>Make time visible.</h1>
            <p> A carefully composed date-range picker for products that need a little more breathing room.</p>
          </header>
          <section className="demo-grid">
            <div className="picker-stage">
              <div className="stage-label">Reservation window</div>
              <DateRangePicker value={value} onChange={setValue} />
              <div className="selection-readout">
                <span>Selected range</span>
                <strong>{formattedRange}</strong>
              </div>
            </div>
            <aside className="notes-panel">
              <span className="note-index">01 / 03</span>
              <h2>Range-first interaction</h2>
              <p>Pick a start, move through the calendar, and finish on the date that closes the window. The component stays controlled by your application state.</p>
              <div className="swatches" aria-hidden="true"><i /><i /><i /></div>
            </aside>
          </section>
        </main>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
