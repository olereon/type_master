import React, { useMemo, useState, useEffect, useRef } from 'react';
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
  overflow: 'visible', // Allow child components to show scrollbars
  display: 'flex',
  flexDirection: 'column',
}));

const MainLayout = styled(Box)<{ isSmallScreen?: boolean }>(({ isSmallScreen }) => ({
  display: 'flex',
  gap: 16,
  height: '100%',
  flexDirection: isSmallScreen ? 'column' : 'row',
  marginTop: '-10px', // Lift all content up by 10px
  overflow: 'visible', // Allow child scrollbars
}));

const LeftSection = styled(Box)(({ theme }) => ({
  width: '600px', // Doubled from 300px
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  minHeight: 0, // Important: allows flex items to shrink
  height: '100%', // Take full height of parent
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
  minHeight: 0, // Important: allows flex item to shrink below content size
  overflowY: 'auto',
  overflowX: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  // Ensure scrollbar is visible
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: 'rgba(128, 128, 128, 0.7)',
    },
  },
}));

const SessionRow = styled(Card)<{ selected?: boolean; scoreColor?: string }>(({ theme, selected, scoreColor }) => ({
  cursor: 'pointer',
  borderLeft: `4px solid ${scoreColor || theme.palette.divider}`,
  backgroundColor: selected ? theme.palette.action.selected : theme.palette.background.paper,
  padding: theme.spacing(1.5),
  flexShrink: 0, // Prevent rows from shrinking
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

// Scrollbox container - always square visible area
const ChartScrollBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '75%', // Base width
  aspectRatio: '1 / 1', // Square visible area
  marginLeft: 'auto',
  marginRight: 'auto',
  overflow: 'hidden', // Hide overflow, scrollbar will be inside
  backgroundColor: 'rgba(255, 255, 255, 0.02)', // Subtle background
  [theme.breakpoints.down('md')]: {
    width: '85%',
  },
}));

// Inner scrollable container
const ChartScrollContainer = styled(Box)({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflowY: 'scroll', // Always show scrollbar
  overflowX: 'hidden',
  // Scrollbar styling
  '&::-webkit-scrollbar': {
    width: '10px',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'rgba(128, 128, 128, 0.05)',
    borderRadius: '5px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: 'rgba(128, 128, 128, 0.7)',
    },
  },
});

// Y-axis component removed - now handled inline within scroll container

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
  width: '10px', // Fixed size for consistent appearance
  height: '10px',
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

const ErrorCross = styled(Box)<{ x: number; y: number }>(({ x, y }) => ({
  position: 'absolute',
  left: `${x}%`,
  bottom: `${y}%`,
  width: '13px',
  height: '13px',
  transform: 'translate(-50%, 50%)', // Center on data point
  zIndex: 25,
  pointerEvents: 'none',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '13px',
    height: '2px',
    backgroundColor: '#FF0000',
    transform: 'translate(-50%, -50%)',
  },
  '&::before': {
    transform: 'translate(-50%, -50%) rotate(45deg)',
  },
  '&::after': {
    transform: 'translate(-50%, -50%) rotate(-45deg)',
  },
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

// New gradient-based color function for more accurate color mapping
const getGradientColor = (wpm: number): string => {
  const normalized = Math.min(Math.max(wpm / 250, 0), 1); // Clamp between 0 and 1
  
  // Define the gradient colors matching the gradient bar
  const colors = [
    { pos: 0, r: 33, g: 150, b: 243 },    // #2196F3 (Blue)
    { pos: 0.25, r: 76, g: 175, b: 80 },  // #4CAF50 (Green)
    { pos: 0.5, r: 255, g: 235, b: 59 },  // #FFEB3B (Yellow)
    { pos: 0.75, r: 255, g: 152, b: 0 },  // #FF9800 (Orange)
    { pos: 1, r: 244, g: 67, b: 54 }      // #F44336 (Red)
  ];
  
  // Find the two colors to interpolate between
  let startColor = colors[0];
  let endColor = colors[1];
  
  for (let i = 0; i < colors.length - 1; i++) {
    if (normalized >= colors[i].pos && normalized <= colors[i + 1].pos) {
      startColor = colors[i];
      endColor = colors[i + 1];
      break;
    }
  }
  
  // Calculate interpolation factor
  const range = endColor.pos - startColor.pos;
  const factor = range === 0 ? 0 : (normalized - startColor.pos) / range;
  
  // Interpolate RGB values
  const r = Math.round(startColor.r + (endColor.r - startColor.r) * factor);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * factor);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * factor);
  
  return `rgb(${r}, ${g}, ${b})`;
};

const StatisticsTab: React.FC = () => {
  console.log('StatisticsTab loaded with new changes!'); // Debug log
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
  const [sessionSortNewestFirst, setSessionSortNewestFirst] = useState(true); // Default: newest first
  const [keySortColumn, setKeySortColumn] = useState<'key' | 'wpm' | 'accuracy' | 'deviation'>('key');
  const [keySortAscending, setKeySortAscending] = useState(true);
  const chartScrollRef = useRef<HTMLDivElement>(null);

  // Calculate session scores once - filter out old UUID sessions and apply sorting
  const sessionsWithScores = useMemo(() => {
    const filtered = sessions
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
    
    // Sort sessions based on sessionSortNewestFirst
    return filtered.sort((a, b) => {
      if (sessionSortNewestFirst) {
        return b.id.localeCompare(a.id); // Newest first (higher IDs first)
      } else {
        return a.id.localeCompare(b.id); // Oldest first (lower IDs first)
      }
    });
  }, [sessions, settings, sessionSortNewestFirst]);

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
        let compareValue = 0;
        if (keySortColumn === 'key') {
          compareValue = a.key.localeCompare(b.key);
        } else if (keySortColumn === 'wpm') {
          const aWpm = 12000 / a.avgTime;
          const bWpm = 12000 / b.avgTime;
          compareValue = aWpm - bWpm;
        } else if (keySortColumn === 'accuracy') {
          compareValue = (a.accuracy || 0) - (b.accuracy || 0);
        } else if (keySortColumn === 'deviation') {
          compareValue = a.deviationPercent - b.deviationPercent;
        } else {
          // Default old sorting
          if (sortColumn === 'key') return a.key.localeCompare(b.key);
          if (sortColumn === 'avgTime') return a.avgTime - b.avgTime;
          if (sortColumn === 'deviationPercent') return a.deviationPercent - b.deviationPercent;
          return 0;
        }
        return keySortAscending ? compareValue : -compareValue;
      });
  }, [selectedSession, averages, sortColumn, keySortColumn, keySortAscending]);

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
      color: getGradientColor(session.wpm), // Use gradient colors
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
      const keyPress = selectedSession.keyPresses[i];
      data.push({
        keypressNumber: i + 1,
        wpm: clampedWpm,
        width: (clampedWpm / 250) * 100,
        color: getGradientColor(clampedWpm), // Use gradient colors
        isIncorrect: keyPress && keyPress.correct === false, // Track incorrect keypresses
      });
    }
    
    return data;
  }, [selectedSession]);

  // Effect to scroll chart to bottom when data changes or chart type changes
  useEffect(() => {
    if (chartScrollRef.current) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        if (chartScrollRef.current) {
          chartScrollRef.current.scrollTop = chartScrollRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [activeChart, wpmDistributionData.length, smoothedWpmData.length]);

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
    <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <Box>
          <Typography variant="h6">Sessions</Typography>
          {selectedSession && (
            <Typography variant="body2" color="text.secondary">
              Selected: Session #{selectedSession.id} {isLatestSession ? '(LAST)' : ''}
            </Typography>
          )}
        </Box>
        <IconButton 
          size="small"
          onClick={() => setSessionSortNewestFirst(!sessionSortNewestFirst)}
          title={sessionSortNewestFirst ? 'Sort: Newest First' : 'Sort: Oldest First'}
        >
          {sessionSortNewestFirst ? '⬇️' : '⬆️'}
        </IconButton>
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
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <TextFieldsIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {session.typedChars}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={0.5}>
                        <ArticleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {Math.floor(session.typedChars / 5)}
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
        <Typography variant="h6">Key Statistics</Typography>
        <Box display="flex" gap={1} alignItems="center">
          <ToggleButtonGroup
            value={tableMode}
            exclusive
            onChange={(_, newMode) => newMode && setTableMode(newMode)}
            size="small"
            sx={{ marginLeft: '-35px' }} // Move left by 35px
          >
            <ToggleButton value="current">
              SLCT
            </ToggleButton>
            <ToggleButton value="comparative">
              CMPR
            </ToggleButton>
          </ToggleButtonGroup>
          <Box display="flex" gap={0.5}>
            <IconButton size="small" onClick={() => { setKeySortColumn('key'); setKeySortAscending(!keySortAscending); }} title="Sort A-Z">
              🔤
            </IconButton>
            <IconButton size="small" onClick={() => { setKeySortColumn('accuracy'); setKeySortAscending(!keySortAscending); }} title="Sort by Accuracy">
              🎯
            </IconButton>
            <IconButton size="small" onClick={() => { setKeySortColumn('wpm'); setKeySortAscending(!keySortAscending); }} title="Sort by WPM">
              ⚡
            </IconButton>
            <IconButton size="small" onClick={() => { setKeySortColumn('deviation'); setKeySortAscending(!keySortAscending); }} title="Sort by Deviation">
              📊
            </IconButton>
          </Box>
        </Box>
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
                WPM {sortColumn === 'avgTime' && '↓'}
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
                      ({(stat.accuracy || 0).toFixed(1)}%)
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end" gap={0.5}>
                    <Typography variant="body2">{(12000 / stat.avgTime).toFixed(1)}</Typography>
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
                        ({stat.deltas.accuracy > 0 ? '+' : ''}{stat.deltas.accuracy.toFixed(1)}%)
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
    const dataCount = activeChart === 'wpmDistribution' ? wpmDistributionData.length : (selectedSession?.keyPresses.length || 0);
    
    // New architecture calculations
    const yAxisLabelWidth = 30; // Width reserved for Y-axis labels
    const gridPadding = 15; // Top and bottom padding for grid
    const scrollbarWidth = 10; // Width of scrollbar
    
    // Grid dimensions
    const totalDataPoints = Math.max(50, dataCount); // Minimum 50 rows
    const largeCellRows = Math.floor(totalDataPoints / 5); // Exactly N_data_points // 5
    const gridRows = totalDataPoints; // Dynamic rows based on data
    
    // Calculate the chart content height dynamically
    // Height = (number of rows / 50) * 100% of container height
    const chartContentHeight = (gridRows / 50) * 100;

    return (
      <Paper sx={{ flex: 1, overflow: 'visible', display: 'flex', flexDirection: 'column', p: 2 }}>
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
          {/* Y-axis label - outside scrollbox on the LEFT */}
          <Typography variant="caption" sx={{ 
            position: 'absolute',
            left: 'calc(12.5% - 90px)', // 12.5% = (100% - 75%) / 2, then 90px to the left (was 50px, now +40px more)
            top: '37%', // Center on scrollbox ??? TESTING 37% for proper position alignment
            transform: 'rotate(-90deg)',
            transformOrigin: 'center',
            whiteSpace: 'nowrap',
            fontSize: '1.6rem', // Doubled from 0.8rem
            fontWeight: 600,
            zIndex: 30
          }}>
            {activeChart === 'wpmDistribution' ? 'Session #' : 'Keypress #'}
          </Typography>

          <ChartScrollBox>
            {/* Chart scroll container */}
            <ChartScrollContainer ref={chartScrollRef}>
              {/* Chart content wrapper - contains grid and all elements */}
              <Box 
                sx={{ 
                  width: '100%',
                  height: `${chartContentHeight}%`,
                  minHeight: '100%',
                  position: 'relative',
                  display: 'flex',
                }}
              >
                {/* Y-axis labels container */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: 0,
                    top: `${gridPadding}px`,
                    bottom: `${gridPadding}px`,
                    width: `${yAxisLabelWidth}px`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    paddingRight: '4px',
                    zIndex: 25,
                  }}
                >
                  {/* Y-axis labels aligned with large grid lines */}
                  {Array.from({ length: largeCellRows + 1 }, (_, i) => i * 5).map((value) => (
                    <Typography 
                      key={value} 
                      variant="caption" 
                      sx={{ 
                        fontSize: '0.65rem',
                        fontWeight: 500,
                        position: 'absolute',
                        right: 4,
                        bottom: `${(value / gridRows) * 100}%`,
                        transform: 'translateY(50%)',
                        color: 'text.secondary',
                        minWidth: '20px',
                        textAlign: 'right',
                      }}
                    >
                      {value}
                    </Typography>
                  ))}
                </Box>

                {/* Grid container */}
                <Box
                  sx={{
                    position: 'absolute',
                    left: `${yAxisLabelWidth}px`,
                    right: 0,
                    top: `${gridPadding}px`,
                    bottom: `${gridPadding}px`,
                    width: `calc(100% - ${yAxisLabelWidth}px)`,
                  }}
                >

                {/* Dynamic Grid - Fixed 50 columns, expandable rows */}
                <GridOverlay showGrid={showGrid}>
                  <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                  {/* Small cell grid lines - 50x(totalGridRows) */}
                  {/* Horizontal lines - one per row */}
                  {[...Array(gridRows - 1)].map((_, i) => (
                    <line
                      key={`grid-small-h-${i}`}
                      x1="0"
                      y1={`${((i + 1) / gridRows) * 100}%`}
                      x2="100%"
                      y2={`${((i + 1) / gridRows) * 100}%`}
                      stroke="#e0e0e0"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  ))}
                  
                  {/* Large cell grid lines - 10x(largeCellRows) */}
                  {/* Horizontal lines - every 5 small cells */}
                  {[...Array(largeCellRows - 1)].map((_, i) => (
                    <line
                      key={`grid-large-h-${i}`}
                      x1="0"
                      y1={`${((i + 1) * 5 / gridRows) * 100}%`}
                      x2="100%"
                      y2={`${((i + 1) * 5 / gridRows) * 100}%`}
                      stroke="#666"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
                  ))}
                  {/* Vertical lines - always 49 (50 columns) */}
                  {[...Array(49)].map((_, i) => (
                    <line
                      key={`grid-small-v-${i}`}
                      x1={`${(i + 1) * 2}%`}
                      y1="0"
                      x2={`${(i + 1) * 2}%`}
                      y2="100%"
                      stroke="#e0e0e0"
                      strokeWidth="0.5"
                      opacity="0.3"
                    />
                  ))}
                  
                  
                  {/* Vertical large grid lines (always 10 columns) */}
                  {[...Array(9)].map((_, i) => (
                    <line
                      key={`grid-large-vertical-${i}`}
                      x1={`${(i + 1) * 10}%`}
                      y1="0"
                      x2={`${(i + 1) * 10}%`}
                      y2="100%"
                      stroke="#666"
                      strokeWidth="1.5"
                      opacity="0.8"
                    />
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
                <DataPointsContainer style={{ height: '100%', minHeight: '100%' }}>
                {activeChart === 'wpmDistribution' && wpmDistributionData.map((data, idx) => {
                  // Position data points to align with horizontal grid lines
                  const yPosition = ((idx + 1) / gridRows) * 100; // As percentage of total grid height
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
                  // Position data points to align with horizontal grid lines
                  const yPosition = ((idx + 1) / gridRows) * 100; // As percentage of total grid height
                  return (
                    <React.Fragment key={idx}>
                      {/* Horizontal line from Y-axis to dot */}
                      <DataLine width={data.width} y={yPosition} />
                      {/* Data point dot */}
                      <Tooltip title={`Keypress ${data.keypressNumber}: ${data.wpm.toFixed(1)} WPM${data.isIncorrect ? ' (Incorrect)' : ''}`}>
                        <DataPoint x={data.width} y={yPosition} color={data.color} />
                      </Tooltip>
                      {/* Error cross for incorrect keypresses */}
                      {data.isIncorrect && (
                        <ErrorCross x={data.width} y={yPosition} />
                      )}
                    </React.Fragment>
                  );
                })}
                </DataPointsContainer>

                {/* Dashed vertical line from triangle for average WPM - extends full grid height */}
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
                    stroke={getGradientColor(selectedSession.wpm)}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                </svg>
                )}
                
                {/* Dashed vertical line for WPM distribution average - extends full grid height */}
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
                    stroke={getGradientColor(averages.avgWPM)}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity="0.8"
                  />
                </svg>
                )}
                </Box>
              </Box>
            </ChartScrollContainer>

          </ChartScrollBox>

          {/* X-axis - outside scrollbox */}
          <Box sx={{ 
            position: 'absolute',
            left: '12.5%', // Align with ChartScrollBox
            width: '75%', // Same as ChartScrollBox
            //marginTop: '16px', // Test adjustment
            top: '82%', // TESTING 82% for proper alignment?? TESTING1 calc(80% + 20px) for proper alignment
            height: '30px',
            '@media (max-width: 960px)': {
              left: '7.5%',
              width: '85%',
            }
          }}>
            <Box sx={{ 
              position: 'absolute',
              left: `${yAxisLabelWidth}px`,
              right: `${scrollbarWidth}px`, // Account for scrollbar
              width: `calc(100% - ${yAxisLabelWidth}px - ${scrollbarWidth}px)`,
              height: '100%',
              display: 'flex',
              alignItems: 'flex-start',
            }}>
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
                fontSize: '0.8rem',
                fontWeight: 600
              }}>
                WPM
              </Typography>
            </Box>
          </Box>

          {/* Gradient bar container - same width as grid */}
          <Box sx={{ 
            position: 'relative',
            width: '75%', // Same as ChartScrollBox width
            marginTop: '40px', // Increased to make room for X-axis labels
            marginLeft: 'auto',
            marginRight: 'auto',
            '@media (max-width: 960px)': {
              width: '85%',
            }
          }}>
            {/* Gradient bar */}
            <Box sx={{ 
              position: 'absolute',
              left: `${yAxisLabelWidth}px`,
              right: `${scrollbarWidth}px`, // Account for scrollbar
              width: `calc(100% - ${yAxisLabelWidth}px - ${scrollbarWidth}px)`,
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
                    left: `calc(${yAxisLabelWidth}px + (100% - ${yAxisLabelWidth}px - ${scrollbarWidth}px) * ${selectedSession.wpm / 250})`, // Adjusted for grid alignment
                    bottom: '100%', // At bottom edge of gradient
                    marginBottom: '30px', // TESTING Lifted by 30px for alignment
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '10px solid', // Points upward (flipped)
                    borderBottomColor: getGradientColor(selectedSession.wpm),
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
                    left: `calc(${yAxisLabelWidth}px + (100% - ${yAxisLabelWidth}px - ${scrollbarWidth}px) * ${averages.avgWPM / 250})`, // Adjusted for grid alignment
                    bottom: '100%', // At bottom edge of gradient
                    marginBottom: '30px', // TESTING Lifted by 30px for alignment
                    transform: 'translateX(-50%)',
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderBottom: '10px solid', // Points upward (flipped)
                    borderBottomColor: getGradientColor(averages.avgWPM),
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