import React, { useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Card,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import SpeedIcon from '@mui/icons-material/Speed';
import GradeIcon from '@mui/icons-material/Grade';
import TimerIcon from '@mui/icons-material/Timer';
import GridOnIcon from '@mui/icons-material/GridOn';
import GridOffIcon from '@mui/icons-material/GridOff';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ArticleIcon from '@mui/icons-material/Article';
import { useAppStore } from '../store/useAppStore';
import { KeyStatistics, TypingSession, SessionMetrics } from '../../types';
import { calculateScore, getScoreColor } from '../utils/score';

// Layout containers
const Container = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0, // Remove top padding to allow manual positioning
  paddingBottom: theme.spacing(1), // Extended bottom padding by 15px
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
}));

const MainLayout = styled(Box)<{ isSmallScreen?: boolean }>(({ isSmallScreen }) => ({
  display: 'flex',
  gap: 16,
  height: '100%',
  flexDirection: isSmallScreen ? 'column' : 'row',
  marginTop: '-10px', // Lift all content up by 10px
}));

const LeftSection = styled(Box)(({ theme }) => ({
  width: '600px', // Doubled from 300px
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
}));

const MiddleSection = styled(Box)(({ theme }) => ({
  flex: '0 0 auto',
  width: '400px', // Reduced fixed width
  minWidth: '300px',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
}));

const RightSection = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  [theme.breakpoints.down('lg')]: {
    width: '100%',
  },
}));

const SessionsList = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const SessionRow = styled(Card)<{ selected?: boolean; scoreColor?: string }>(({ theme, selected, scoreColor }) => ({
  cursor: 'pointer',
  borderLeft: `4px solid ${scoreColor || theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
  padding: theme.spacing(1.5),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CompactTableRow = styled(TableRow)(({ theme }) => ({
  '& .MuiTableCell-root': {
    padding: theme.spacing(0.5, 1),
    fontSize: '0.875rem',
    lineHeight: 1.2,
  },
}));

// Removed unused GradientBar component

const ChartContainer = styled(Box)({
  position: 'relative',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: 130, // More space for gradient bar at bottom
});

const ChartContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '75%', // 75% of column width
  aspectRatio: '1 / 1', // Keep it square
  display: 'flex',
  marginLeft: 'auto',
  marginRight: 'auto',
  [theme.breakpoints.down('md')]: {
    width: '85%',
  },
}));

const ChartScrollContainer = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

const YAxis = styled(Box)({
  position: 'absolute',
  left: '-15%',
  top: 0,
  bottom: 0,
  width: '15%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  paddingRight: '8px',
});

const XAxis = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: '-10%',
  height: '10%',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  paddingTop: '8px',
});

const GridOverlay = styled(Box)<{ showGrid: boolean }>(({ showGrid }) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  pointerEvents: 'none',
  display: showGrid ? 'block' : 'none',
}));

const DataPointsContainer = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
});

const DataPoint = styled(Box)<{ x: number; y: number; color: string }>(({ x, y, color }) => ({
  position: 'absolute',
  left: `${x}%`,
  bottom: `${y}%`,
  width: '1%', // 1% of grid width
  aspectRatio: '1 / 1', // Keep circular
  borderRadius: '50%',
  backgroundColor: color,
  transform: 'translate(-50%, 50%)', // Center on position
  zIndex: 20,
  cursor: 'pointer',
}));

const DataLine = styled(Box)<{ width: number; y: number }>(({ width, y, theme }) => ({
  position: 'absolute',
  left: 0,
  bottom: `${y}%`,
  width: `${width}%`,
  height: '3px',
  backgroundColor: theme.palette.primary.main,
  transform: 'translateY(50%)', // Center on grid line
  zIndex: 10,
}));

// Header icon with value
const MetricItem = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

// Cache for expensive calculations
const averageCache = new Map<string, any>();

// Extended KeyStatistics interface for comparative mode
interface ComparativeKeyStatistics extends KeyStatistics {
  keypressSpeed?: number;
  accuracy?: number;
  deltas?: {
    keypressSpeed: number;
    wpmDeviation: number;
    accuracy: number;
  };
}

// Helper function to get color from WPM value
const getWpmColor = (wpm: number, maxWpm: number = 250): string => {
  const normalized = Math.min(1, wpm / maxWpm);
  
  if (normalized < 0.2) return '#2196F3'; // Blue
  if (normalized < 0.4) return '#4CAF50'; // Green
  if (normalized < 0.6) return '#FFEB3B'; // Yellow
  if (normalized < 0.8) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

const StatisticsTab: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const { sessions, settings, resetAllSessions, currentSession } = useAppStore();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [tableMode, setTableMode] = useState<'current' | 'comparative'>('current');
  const [activeChart, setActiveChart] = useState<'wpmDistribution' | 'smoothedWpm'>('wpmDistribution');
  const [smallScreenTab, setSmallScreenTab] = useState(0);
  const [sortColumn, setSortColumn] = useState<'key' | 'avgTime' | 'deviationPercent'>('key');
  const [showGrid, setShowGrid] = useState(true);

  // Calculate session scores once - filter out old UUID sessions
  const sessionsWithScores = useMemo(() => {
    return sessions
      .filter(session => {
        // Keep only sessions with timestamp format (contains dashes and numbers)
        return /^\d{5}-\d{4}-\d{2}-\d{2}-\d{6}$/.test(session.id);
      })
      .map(session => ({
        ...session,
        score: session.score || calculateScore(
          session.wpm,
          session.accuracy / 100,
          session.typedChars,
          settings.scoreK0,
          settings.scoreK1,
          settings.scoreK2
        ),
      }));
  }, [sessions, settings]);

  const selectedSession = useMemo(() => {
    if (selectedSessionId) {
      return sessionsWithScores.find(s => s.id === selectedSessionId);
    }
    return currentSession && currentSession.keyPresses.length > 0 ? currentSession : sessionsWithScores[0]; // Get first (newest) session
  }, [selectedSessionId, sessionsWithScores, currentSession]);

  // Calculate averages for the specified number of sessions
  const averages = useMemo(() => {
    const cacheKey = `${settings.sessionsForAverage}-${sessionsWithScores.length}`;
    
    if (averageCache.has(cacheKey)) {
      return averageCache.get(cacheKey);
    }

    if (sessionsWithScores.length === 0) return null;

    const sessionsToUse = Math.min(settings.sessionsForAverage, sessionsWithScores.length);
    const relevantSessions = sessionsWithScores.slice(0, sessionsToUse); // Take from beginning (newest)

    const stats = new Map<string, { times: number[], correct: number, total: number }>();
    
    relevantSessions.forEach(session => {
      session.keyPresses.forEach(kp => {
        if (!kp.timeSinceLastKey) return;
        
        const key = kp.char.toLowerCase();
        if (!stats.has(key)) {
          stats.set(key, { times: [], correct: 0, total: 0 });
        }
        
        const keyStats = stats.get(key)!;
        keyStats.times.push(kp.timeSinceLastKey);
        keyStats.total++;
        if (kp.correct) keyStats.correct++;
      });
    });

    const avgWPM = relevantSessions.reduce((sum, s) => sum + s.wpm, 0) / relevantSessions.length;
    
    const result = {
      avgWPM,
      keyStats: stats,
      sessionCount: relevantSessions.length,
    };

    averageCache.set(cacheKey, result);
    return result;
  }, [sessionsWithScores, settings.sessionsForAverage]);

  // Key statistics calculation
  const keyStatistics = useMemo((): ComparativeKeyStatistics[] => {
    if (!selectedSession) return [];
    
    const stats = new Map<string, { times: number[], correct: number, total: number }>();
    
    selectedSession.keyPresses.forEach((kp) => {
      if (!kp.timeSinceLastKey) return;
      
      const key = kp.char.toLowerCase();
      if (!stats.has(key)) {
        stats.set(key, { times: [], correct: 0, total: 0 });
      }
      
      const keyStats = stats.get(key)!;
      keyStats.times.push(kp.timeSinceLastKey);
      keyStats.total++;
      if (kp.correct) keyStats.correct++;
    });
    
    const avgWpm = averages?.avgWPM || selectedSession.wpm;
    const result = [...stats.entries()]
      .map(([key, data]) => {
        const avgTime = data.times.reduce((a, b) => a + b, 0) / data.times.length;
        const keypressSpeed = avgWpm / (avgTime / 1000) / 60;
        return {
          key,
          avgTime,
          deviationPercent: 0, // Will be calculated below
          totalPresses: data.total,
          correctPresses: data.correct,
          keypressSpeed,
          accuracy: (data.correct / data.total) * 100,
        };
      });
    
    // Calculate average of avgTime for deviation calculation
    const avgOfAvgTimes = result.reduce((sum, stat) => sum + stat.avgTime, 0) / result.length;
    
    // Calculate deviation percent
    result.forEach((stat) => {
      stat.deviationPercent = ((stat.avgTime - avgOfAvgTimes) / avgOfAvgTimes) * 100;
    });
    
    return result
      .sort((a: ComparativeKeyStatistics, b: ComparativeKeyStatistics) => {
        if (sortColumn === 'key') return a.key.localeCompare(b.key);
        if (sortColumn === 'avgTime') return a.avgTime - b.avgTime;
        if (sortColumn === 'deviationPercent') return a.deviationPercent - b.deviationPercent;
        return 0;
      });
  }, [selectedSession, averages, sortColumn]);

  // Comparative key statistics
  const comparativeKeyStatistics = useMemo((): ComparativeKeyStatistics[] => {
    if (!selectedSession || !averages) return keyStatistics; // Always return data

    return keyStatistics.map(stat => {
      const avgKeyStats = averages.keyStats.get(stat.key);
      if (!avgKeyStats) return { ...stat, deltas: { keypressSpeed: 0, wpmDeviation: 0, accuracy: 0 } };

      const avgTime = avgKeyStats.times.reduce((a: number, b: number) => a + b, 0) / avgKeyStats.times.length;
      const avgKeypressSpeed = averages.avgWPM / (avgTime / 1000) / 60;
      const avgAccuracy = (avgKeyStats.correct / avgKeyStats.total) * 100;

      return {
        ...stat,
        deltas: {
          keypressSpeed: (stat.keypressSpeed || 0) - avgKeypressSpeed,
          wpmDeviation: ((stat.keypressSpeed || 0) - avgKeypressSpeed) / avgKeypressSpeed * 100,
          accuracy: (stat.accuracy || 0) - avgAccuracy,
        },
      };
    });
  }, [keyStatistics, averages]);

  // WPM distribution data - reversed to show oldest first in chart
  const wpmDistributionData = useMemo(() => {
    const lastSessions = sessionsWithScores.slice(-150).reverse(); // Reverse to show oldest at bottom
    return lastSessions.map((session, index) => ({
      sessionNumber: index + 1,
      wpm: session.wpm,
      width: (session.wpm / 250) * 100,
      color: getWpmColor(session.wpm),
    }));
  }, [sessionsWithScores]);

  // Smoothed WPM data
  const smoothedWpmData = useMemo(() => {
    if (!selectedSession || !selectedSession.keyPresses.length) return [];
    
    const data = [];
    const smoothingWindow = 5;
    
    for (let i = 0; i < selectedSession.keyPresses.length; i++) {
      const startIdx = Math.max(0, i - Math.floor(smoothingWindow / 2));
      const endIdx = Math.min(selectedSession.keyPresses.length - 1, i + Math.floor(smoothingWindow / 2));
      
      let totalTime = 0;
      let charCount = 0;
      
      for (let j = startIdx; j <= endIdx; j++) {
        if (j > 0) {
          totalTime += selectedSession.keyPresses[j].timeSinceLastKey || 0;
          charCount++;
        }
      }
      
      let wpm = 0;
      if (i < 4) {
        // For first 4 keypresses, use session average
        wpm = selectedSession.wpm;
      } else if (totalTime > 0 && charCount > 0) {
        const avgTimePerChar = totalTime / charCount / 1000; // Convert to seconds
        const charsPerMinute = 60 / avgTimePerChar;
        wpm = charsPerMinute / 5; // 5 chars per word
      }
      
      const clampedWpm = Math.min(250, Math.max(0, wpm));
      data.push({
        keypressNumber: i + 1,
        wpm: clampedWpm,
        width: (clampedWpm / 250) * 100,
        color: getWpmColor(clampedWpm),
      });
    }
    
    return data;
  }, [selectedSession]);

  // Session metrics calculation
  const sessionMetrics = useMemo((): SessionMetrics => {
    const totalRuns = sessions.length;
    const totalCharacters = sessions.reduce((sum, s) => sum + s.typedChars, 0);
    const totalWords = Math.floor(totalCharacters / 5);
    const maxWPM = sessions.length > 0 ? Math.max(...sessions.map(s => s.wpm)) : 0;
    const avgWPM = sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.wpm, 0) / sessions.length) : 0;
    
    return { totalRuns, totalCharacters, totalWords, maxWPM, avgWPM };
  }, [sessions]);

  const handleResetConfirm = () => {
    resetAllSessions();
    setResetDialogOpen(false);
    setSelectedSessionId(null);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.round(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${seconds}s`;
  };

  const getSessionScore = (session: TypingSession) => {
    return session.score || calculateScore(
      session.wpm,
      session.accuracy / 100,
      session.typedChars,
      settings.scoreK0,
      settings.scoreK1,
      settings.scoreK2
    );
  };

  // Get fire icon size and color for top 3 scores
  const getFireIconProps = (session: TypingSession, allSessions: TypingSession[]) => {
    const allScores = allSessions.map(s => getSessionScore(s)).sort((a, b) => b - a);
    const score = getSessionScore(session);
    const rank = allScores.indexOf(score) + 1;

    if (rank === 1 && score > 0) return { size: 'medium', color: '#F44336' }; // Red - 1st place
    if (rank === 2 && score > 0) return { size: 'small', color: '#FF9800' }; // Orange - 2nd place
    if (rank === 3 && score > 0) return { size: 'small', color: '#FFEB3B', sx: { fontSize: '0.75rem' } }; // Yellow - 3rd place
    return null;
  };

  // Removed unused getYAxisLabels function - using static labels instead

  // Check if selected session is the latest
  const isLatestSession = selectedSession && sessionsWithScores[0] && selectedSession.id === sessionsWithScores[0].id;

  // Render different sections
  const renderStatisticsHeader = () => (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap' }}>
        <MetricItem>
          <Tooltip title="Total runs">
            <KeyboardIcon fontSize="small" color="primary" />
          </Tooltip>
          <Typography variant="body2">{sessionMetrics.totalRuns}</Typography>
        </MetricItem>
        
        <MetricItem>
          <Tooltip title="Total characters">
            <TextFieldsIcon fontSize="small" color="primary" />
          </Tooltip>
          <Typography variant="body2">{sessionMetrics.totalCharacters.toLocaleString()}</Typography>
        </MetricItem>

        <MetricItem>
          <Tooltip title="Total words">
            <ArticleIcon fontSize="small" color="primary" />
          </Tooltip>
          <Typography variant="body2">{sessionMetrics.totalWords.toLocaleString()}</Typography>
        </MetricItem>
        
        <MetricItem>
          <Tooltip title="Max WPM">
            <SpeedIcon fontSize="small" color="primary" />
          </Tooltip>
          <Typography variant="body2">{sessionMetrics.maxWPM}</Typography>
        </MetricItem>

        <MetricItem>
          <Tooltip title="Average WPM">
            <SpeedIcon fontSize="small" color="secondary" />
          </Tooltip>
          <Typography variant="body2">{sessionMetrics.avgWPM}</Typography>
        </MetricItem>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption" color="text.secondary">
          Using last {averages?.sessionCount || 0} sessions for averages
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => setResetDialogOpen(true)}
          disabled={sessions.length === 0}
        >
          Reset All
        </Button>
      </Box>
    </Paper>
  );

  const renderSessionsList = () => (
    <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6">Sessions</Typography>
        {selectedSession && (
          <Typography variant="body2" color="text.secondary">
            Selected: Session #{selectedSession.id} {isLatestSession ? '(LAST)' : ''}
          </Typography>
        )}
      </Box>
      <SessionsList sx={{ p: 2 }}>
        {sessionsWithScores.length === 0 ? (
          <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
            No sessions recorded yet
          </Typography>
        ) : (
          sessionsWithScores.map((session) => {
            const score = getSessionScore(session);
            const allScores = sessionsWithScores.map(s => getSessionScore(s));
            const maxScore = allScores.length > 0 ? Math.max(...allScores) : 1000;
            const scoreColor = getScoreColor(score, maxScore);
            const fireIconProps = getFireIconProps(session, sessionsWithScores);
            
            return (
              <SessionRow
                key={session.id}
                selected={session.id === selectedSession?.id}
                scoreColor={scoreColor}
                onClick={() => setSelectedSessionId(session.id)}
              >
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" fontWeight={500}>
                      Session #{session.id}
                    </Typography>
                    <Box display="flex" gap={1} alignItems="center" mt={0.5}>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <SpeedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {session.wpm}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <GradeIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {session.accuracy.toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <TimerIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatTime((session.endTime ? new Date(session.endTime).getTime() : Date.now()) - new Date(session.startTime).getTime())}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" gap={0.5} alignItems="center">
                    {fireIconProps && (
                      <Tooltip title={`Top ${fireIconProps.color === '#F44336' ? '1' : fireIconProps.color === '#FF9800' ? '2' : '3'} Score!`}>
                        <WhatshotIcon 
                          fontSize={fireIconProps.size as any}
                          sx={{ 
                            color: fireIconProps.color,
                            ...fireIconProps.sx 
                          }} 
                        />
                      </Tooltip>
                    )}
                    <Chip
                      label={Math.round(score)}
                      size="small"
                      sx={{
                        backgroundColor: scoreColor,
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                </Box>
              </SessionRow>
            );
          })
        )}
      </SessionsList>
    </Paper>
  );

  const renderKeyPerformanceTable = () => (
    <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Key Performance</Typography>
        <ToggleButtonGroup
          value={tableMode}
          exclusive
          onChange={(_, newMode) => newMode && setTableMode(newMode)}
          size="small"
        >
          <ToggleButton value="current">
            Current
          </ToggleButton>
          <ToggleButton value="comparative">
            Comparative
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      <TableContainer sx={{ flex: 1 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <CompactTableRow>
              <TableCell 
                onClick={() => setSortColumn('key')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Key {sortColumn === 'key' && '↓'}
              </TableCell>
              <TableCell 
                align="right"
                onClick={() => setSortColumn('avgTime')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Time {sortColumn === 'avgTime' && '↓'}
              </TableCell>
              <TableCell 
                align="right"
                onClick={() => setSortColumn('deviationPercent')}
                sx={{ cursor: 'pointer', userSelect: 'none' }}
              >
                Dev% {sortColumn === 'deviationPercent' && '↓'}
              </TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Correct</TableCell>
            </CompactTableRow>
          </TableHead>
          <TableBody>
            {(tableMode === 'comparative' ? comparativeKeyStatistics : keyStatistics).map((stat) => (
              <CompactTableRow key={stat.key}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <Typography variant="body2" fontWeight={500}>
                      {stat.key === ' ' ? '␣' : stat.key}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      ({(stat.accuracy || 0).toFixed(0)}%)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                    <Typography variant="body2">{stat.avgTime.toFixed(0)}ms</Typography>
                    {tableMode === 'comparative' && stat.deltas && (
                      <>
                        {stat.deltas.keypressSpeed > 0 ? (
                          <ArrowUpwardIcon sx={{ fontSize: 10, color: 'success.main' }} />
                        ) : (
                          <ArrowDownwardIcon sx={{ fontSize: 10, color: 'error.main' }} />
                        )}
                        <Typography variant="caption" color={stat.deltas.keypressSpeed > 0 ? 'success.main' : 'error.main'} sx={{ fontSize: '0.7rem' }}>
                          {Math.abs(stat.deltas.keypressSpeed).toFixed(0)}
                        </Typography>
                      </>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                    <Typography variant="body2">
                      {stat.deviationPercent > 0 ? '+' : ''}{stat.deviationPercent.toFixed(0)}%
                    </Typography>
                    {tableMode === 'comparative' && stat.deltas && (
                      <Typography variant="caption" color={stat.deltas.wpmDeviation > 0 ? 'success.main' : 'error.main'} sx={{ fontSize: '0.7rem' }}>
                        ({stat.deltas.wpmDeviation > 0 ? '+' : ''}{stat.deltas.wpmDeviation.toFixed(0)}%)
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">{stat.totalPresses}</TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                    <Typography variant="body2">{stat.correctPresses}</Typography>
                    {tableMode === 'comparative' && stat.deltas && (
                      <Typography variant="caption" color={stat.deltas.accuracy > 0 ? 'success.main' : 'error.main'} sx={{ fontSize: '0.7rem' }}>
                        ({stat.deltas.accuracy > 0 ? '+' : ''}{stat.deltas.accuracy.toFixed(0)}%)
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </CompactTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  const renderCharts = () => {
    // const yAxisLabels = getYAxisLabels(); // Not needed - using static labels
    const dataCount = activeChart === 'wpmDistribution' ? wpmDistributionData.length : (selectedSession?.keyPresses.length || 0);
    const needsScroll = dataCount > 50; // Changed from 250 to 50

    return (
      <Paper sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ ml: '150px' }}>Performance Visualization</Typography>
          <Box display="flex" gap={1}>
            <IconButton 
              size="small"
              onClick={() => setShowGrid(!showGrid)}
              color={showGrid ? 'primary' : 'default'}
            >
              {showGrid ? <GridOnIcon /> : <GridOffIcon />}
            </IconButton>
            <ToggleButtonGroup
              value={activeChart}
              exclusive
              onChange={(_, newChart) => newChart && setActiveChart(newChart)}
              size="small"
            >
              <ToggleButton value="wpmDistribution">
                <ViewModuleIcon sx={{ mr: 0.5 }} />
                WPM Distribution
              </ToggleButton>
              <ToggleButton value="smoothedWpm">
                <ViewListIcon sx={{ mr: 0.5 }} />
                Smoothed WPM
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>
        
        <ChartContainer>
          <ChartContent>
            {/* Y-axis */}
            <YAxis>
              <Typography variant="caption" sx={{ 
                position: 'absolute',
                left: '-50%',
                top: '50%', // Aligned with 25 on Y-axis
                transform: 'rotate(-90deg)',
                transformOrigin: 'center',
                whiteSpace: 'nowrap',
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                {activeChart === 'wpmDistribution' ? 'Session #' : 'Keypress #'}
              </Typography>
              {/* Y-axis labels aligned with horizontal grid lines */}
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50].map((value) => (
                <Typography 
                  key={value} 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.7rem',
                    fontWeight: 500,
                    position: 'absolute',
                    right: 8,
                    bottom: `${value * 2}%`, // Each unit = 2% (50 units = 100%)
                    transform: 'translateY(50%)'
                  }}
                >
                  {value}
                </Typography>
              ))}
            </YAxis>

            {/* Chart scroll container */}
            <ChartScrollContainer
              sx={{
                overflowY: needsScroll ? 'auto' : 'hidden',
              }}
            >
              {/* Grid - 10x10 large cells with 5x5 small cells inside each */}
              <GridOverlay showGrid={showGrid}>
                <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                  {/* Small cell grid lines (5x5 within each large cell) - 2% intervals */}
                  {[...Array(49)].map((_, i) => (
                    <React.Fragment key={`grid-small-${i}`}>
                      {/* Horizontal small grid lines */}
                      <line
                        x1="0"
                        y1={`${(i + 1) * 2}%`}
                        x2="100%"
                        y2={`${(i + 1) * 2}%`}
                        stroke="#e0e0e0"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                      {/* Vertical small grid lines */}
                      <line
                        x1={`${(i + 1) * 2}%`}
                        y1="0"
                        x2={`${(i + 1) * 2}%`}
                        y2="100%"
                        stroke="#e0e0e0"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                    </React.Fragment>
                  ))}
                  
                  {/* Large cell grid lines (10x10) - 10% intervals */}
                  {[...Array(9)].map((_, i) => (
                    <React.Fragment key={`grid-large-${i}`}>
                      {/* Horizontal large grid lines */}
                      <line
                        x1="0"
                        y1={`${(i + 1) * 10}%`}
                        x2="100%"
                        y2={`${(i + 1) * 10}%`}
                        stroke="#666"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                      {/* Vertical large grid lines */}
                      <line
                        x1={`${(i + 1) * 10}%`}
                        y1="0"
                        x2={`${(i + 1) * 10}%`}
                        y2="100%"
                        stroke="#666"
                        strokeWidth="1.5"
                        opacity="0.8"
                      />
                    </React.Fragment>
                  ))}
                  
                  {/* Chart border */}
                  <rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="#666"
                    strokeWidth="2"
                  />
                </svg>
              </GridOverlay>

              {/* Chart data points */}
              <DataPointsContainer style={{ height: needsScroll ? `${dataCount * 2}%` : '100%', minHeight: '100%' }}>
                {activeChart === 'wpmDistribution' && wpmDistributionData.map((data, idx) => {
                  const yPosition = (idx + 1) * 2; // Each point on a grid line (2% intervals)
                  return (
                    <React.Fragment key={idx}>
                      {/* Horizontal line from Y-axis to dot */}
                      <DataLine width={data.width} y={yPosition} />
                      {/* Data point dot */}
                      <Tooltip title={`Session ${data.sessionNumber}: ${data.wpm.toFixed(1)} WPM`}>
                        <DataPoint x={data.width} y={yPosition} color={data.color} />
                      </Tooltip>
                    </React.Fragment>
                  );
                })}
                
                {activeChart === 'smoothedWpm' && selectedSession && smoothedWpmData.map((data, idx) => {
                  const yPosition = (idx + 1) * 2; // Each point on a grid line (2% intervals)
                  return (
                    <React.Fragment key={idx}>
                      {/* Horizontal line from Y-axis to dot */}
                      <DataLine width={data.width} y={yPosition} />
                      {/* Data point dot */}
                      <Tooltip title={`Keypress ${data.keypressNumber}: ${data.wpm.toFixed(1)} WPM`}>
                        <DataPoint x={data.width} y={yPosition} color={data.color} />
                      </Tooltip>
                    </React.Fragment>
                  );
                })}
              </DataPointsContainer>

              {/* Dashed vertical line from triangle for average WPM */}
              {activeChart === 'smoothedWpm' && selectedSession && (
                <svg 
                  width="100%" 
                  height="100%" 
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 15 }}
                >
                  <line
                    x1={`${(selectedSession.wpm / 250) * 100}%`}
                    y1="0"
                    x2={`${(selectedSession.wpm / 250) * 100}%`}
                    y2="100%"
                    stroke={getWpmColor(selectedSession.wpm)}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                </svg>
              )}
              
              {/* Dashed vertical line for WPM distribution average */}
              {activeChart === 'wpmDistribution' && averages && (
                <svg 
                  width="100%" 
                  height="100%" 
                  style={{ position: 'absolute', top: 0, left: 0, zIndex: 15 }}
                >
                  <line
                    x1={`${(averages.avgWPM / 250) * 100}%`}
                    y1="0"
                    x2={`${(averages.avgWPM / 250) * 100}%`}
                    y2="100%"
                    stroke={getWpmColor(averages.avgWPM)}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                </svg>
              )}
            </ChartScrollContainer>

            {/* X-axis */}
            <XAxis>
              {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250].map((value, index) => (
                <Typography 
                  key={value} 
                  variant="caption" 
                  sx={{ 
                    fontSize: '0.7rem',
                    position: 'absolute',
                    left: `${(index * 10)}%`,
                    transform: 'translateX(-50%)',
                    fontWeight: 500
                  }}
                >
                  {value}
                </Typography>
              ))}
              <Typography variant="caption" sx={{ 
                position: 'absolute',
                left: '100%', // At right edge
                marginLeft: '20px', // Space after 250
                marginTop: '6px', // Manual adjustment for better alignment
                top: '0', // Align with X-axis numbers
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                WPM
              </Typography>
            </XAxis>
          </ChartContent>

          {/* Gradient bar container - same width as grid */}
          <Box sx={{ 
            position: 'relative',
            width: '75%', // Same as ChartContent width
            marginTop: '25px', // Lowered by 25px to align with grid
            '@media (max-width: 960px)': {
              width: '85%',
            }
          }}>
            {/* Gradient bar */}
            <Box sx={{ 
              width: '100%',
              height: '10px',
              background: 'linear-gradient(to right, #2196F3 0%, #4CAF50 25%, #FFEB3B 50%, #FF9800 75%, #F44336 100%)',
              borderRadius: 1,
            }} />
            
            {/* Triangular marker for session avg WPM. Pointing up from bottom of grid */}
            {activeChart === 'smoothedWpm' && selectedSession && (
              <Tooltip title={`Session Average: ${selectedSession.wpm.toFixed(0)} WPM`}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${(selectedSession.wpm / 250) * 100}%`, // Position as percentage
                    bottom: '100%', // At bottom edge of gradient (top of triangle at grid bottom)
                    marginBottom: '20px', // Move up to align with grid bottom
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '12px solid', // Points upward (flipped)
                    borderBottomColor: getWpmColor(selectedSession.wpm),
                    zIndex: 25,
                  }}
                />
              </Tooltip>
            )}
            
            {/* Triangular marker for WPM distribution average */}
            {activeChart === 'wpmDistribution' && averages && (
              <Tooltip title={`Average: ${averages.avgWPM.toFixed(0)} WPM`}>
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${(averages.avgWPM / 250) * 100}%`, // Position as percentage
                    bottom: '100%', // At bottom edge of gradient (top of triangle at grid bottom)
                    marginBottom: '20px', // Move up to align with grid bottom
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '8px solid transparent',
                    borderRight: '8px solid transparent',
                    borderBottom: '12px solid', // Points upward (flipped)
                    borderBottomColor: getWpmColor(averages.avgWPM),
                    zIndex: 25,
                  }}
                />
              </Tooltip>
            )}
          </Box>
          
        </ChartContainer>
      </Paper>
    );
  };

  // Main render
  if (isSmallScreen) {
    return (
      <Container>
        <Tabs value={smallScreenTab} onChange={(_, newValue) => setSmallScreenTab(newValue)} sx={{ mb: 2 }}>
          <Tab label="Overview" />
          <Tab label="Details" />
        </Tabs>
        
        {smallScreenTab === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            {renderStatisticsHeader()}
            {renderSessionsList()}
          </Box>
        )}
        
        {smallScreenTab === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
            {renderKeyPerformanceTable()}
            {renderCharts()}
          </Box>
        )}
        
        <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
          <DialogTitle>Reset All Sessions?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will permanently delete all {sessions.length} recorded sessions. This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetConfirm} color="error" variant="contained">
              Reset All
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }

  return (
    <Container>
      <MainLayout>
        <LeftSection>
          {renderStatisticsHeader()}
          {renderSessionsList()}
        </LeftSection>
        
        <MiddleSection>
          {renderKeyPerformanceTable()}
        </MiddleSection>
        
        <RightSection>
          {renderCharts()}
        </RightSection>
      </MainLayout>
      
      <Dialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)}>
        <DialogTitle>Reset All Sessions?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently delete all {sessions.length} recorded sessions. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleResetConfirm} color="error" variant="contained">
            Reset All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StatisticsTab;