import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, Paper, ThemeProvider, createTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import MainTab from './components/MainTab';
import SettingsTab from './components/SettingsTab';
import TextSourceTab from './components/TextSourceTab';
import StatisticsTab from './components/StatisticsTab';
import SessionMetricsHeader from './components/SessionMetricsHeader';
import { useAppStore } from './store/useAppStore';
import { SessionMetrics } from '../types';
import { theme as defaultTheme } from './styles/theme';

const StyledPaper = styled(Paper)(() => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 0,
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
}));

const TabPanel = styled(Box)({
  flexGrow: 1,
  overflow: 'hidden',
  display: 'flex',
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ width: '100%', height: '100%' }}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const { sessions, settings, setTypingFieldActive, clearCurrentSession } = useAppStore();
  const [sessionMetrics, setSessionMetrics] = useState<SessionMetrics>({
    totalRuns: 0,
    totalCharacters: 0,
    totalWords: 0,
    maxWPM: 0,
    avgWPM: 0,
  });

  // Create dynamic theme with user's primary color
  const theme = React.useMemo(
    () => createTheme({
      ...defaultTheme,
      palette: {
        ...defaultTheme.palette,
        primary: {
          main: settings.primaryColor,
          light: settings.primaryColor,
          dark: settings.primaryColor,
        },
      },
    }),
    [settings.primaryColor]
  );

  useEffect(() => {
    const completedSessions = sessions.filter(s => s.endTime);
    const totalRuns = completedSessions.length;
    const totalCharacters = completedSessions.reduce((acc, s) => acc + s.typedChars, 0);
    const totalWords = completedSessions.reduce((acc, s) => acc + Math.floor(s.typedChars / 5), 0);
    const wpms = completedSessions.map(s => s.wpm);
    const maxWPM = wpms.length > 0 ? Math.max(...wpms) : 0;
    const avgWPM = wpms.length > 0 ? wpms.reduce((a, b) => a + b, 0) / wpms.length : 0;

    setSessionMetrics({
      totalRuns,
      totalCharacters,
      totalWords,
      maxWPM: Math.round(maxWPM),
      avgWPM: Math.round(avgWPM),
    });
  }, [sessions]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Reset typing field when switching tabs (similar to Alt key)
    setTypingFieldActive(false);
    clearCurrentSession();
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledPaper elevation={0}>
        <HeaderContainer>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Main" />
            <Tab label="Settings" />
            <Tab label="Text Source" />
            <Tab label="Statistics" />
          </Tabs>
          <SessionMetricsHeader metrics={sessionMetrics} />
        </HeaderContainer>
        
        <TabPanel>
          <CustomTabPanel value={tabValue} index={0}>
            <MainTab />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={1}>
            <SettingsTab />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={2}>
            <TextSourceTab />
          </CustomTabPanel>
          <CustomTabPanel value={tabValue} index={3}>
            <StatisticsTab />
          </CustomTabPanel>
        </TabPanel>
      </StyledPaper>
    </ThemeProvider>
  );
}

export default App;