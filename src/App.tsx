import {
  Box,
  Container,
  CssBaseline,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { useState } from 'react'
import { DateRangePicker } from './DateRangePicker'
import type { DateRange } from './types'

const theme = createTheme({
  palette: {
    background: { default: '#f4efe5', paper: '#fffdf8' },
    text: { primary: '#233332', secondary: '#64716c' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Avenir Next, Helvetica Neue, sans-serif',
    h1: { fontFamily: 'Georgia, serif', fontWeight: 400, letterSpacing: '-0.04em' },
    h2: { fontFamily: 'Georgia, serif', fontWeight: 400 },
  },
})

function App() {
  const [value, setValue] = useState<DateRange<Date>>([null, null])
  const formattedRange = value[0] && value[1]
    ? `${value[0].toLocaleDateString()} - ${value[1].toLocaleDateString()}`
    : 'Choose a start and end date'

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
          <Stack spacing={6}>
            <Box sx={{ maxWidth: 700 }}>
              <Typography sx={{ color: 'primary.main', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                Free MUI primitive
              </Typography>
              <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '6.75rem' }, lineHeight: 0.96, mt: 1.5, mb: 1.25 }}>
                Make time visible.
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: '1.05rem', maxWidth: 520 }}>
                A carefully composed date-range picker for products that need a little more breathing room.
              </Typography>
            </Box>
            <Grid container spacing={0}>
              <Grid size={{ xs: 12, md: 8 }}>
                <Paper variant="outlined" sx={{ minHeight: 420, p: { xs: 2.75, md: 3.75 }, bgcolor: 'background.paper' }}>
                  <Typography sx={{ color: 'primary.main', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    Reservation window
                  </Typography>
                  <Box sx={{ mt: 5 }}>
                    <DateRangePicker value={value} onChange={setValue} />
                  </Box>
                  <Divider sx={{ mt: 6, mb: 2.25 }} />
                  <Stack spacing={0.75}>
                    <Typography sx={{ color: 'text.secondary', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                      Selected range
                    </Typography>
                    <Typography variant="h2" sx={{ fontSize: '1.5rem' }}>{formattedRange}</Typography>
                  </Stack>
                </Paper>
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <Paper variant="outlined" sx={{ height: '100%', minHeight: 420, p: { xs: 2.75, md: 3.75 }, bgcolor: '#233332', color: '#f4efe5', borderColor: '#233332', borderRadius: 0 }}>
                  <Stack height="100%" justifyContent="space-between">
                    <Typography sx={{ color: '#efad65', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em' }}>01 / 03</Typography>
                    <Box>
                      <Typography variant="h2" color="inherit" sx={{ fontSize: '2rem', lineHeight: 1.05, mb: 1.5 }}>Range-first interaction</Typography>
                      <Typography sx={{ color: '#bbc5bd', lineHeight: 1.65 }}>Pick a start, move through the calendar, and finish on the date that closes the window. The component stays controlled by your application state.</Typography>
                    </Box>
                    <Stack direction="row" spacing={1} aria-hidden="true">
                      {['#e45b3f', '#efad65', '#7eb5a6'].map((color) => <Box key={color} width={28} height={8} borderRadius={99} bgcolor={color} />)}
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

export default App
