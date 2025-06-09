import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, LinearProgress, Paper, Modal, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import ControlPanel from './ControlPanel';
import TypingArea, { TYPING_PADDING_CHAR } from './TypingArea';
import { useAppStore } from '../store/useAppStore';
import { TypingSession, KeyPress } from '../../types';
import { calculateScore } from '../utils/score';

const MainContainer = styled(Box)({
  display: 'flex',
  height: '100%',
  width: '100%',
});

const MetricsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
}));

const MetricItem = styled(Box)(() => ({
  textAlign: 'center',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const ContentArea = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
}));

const StatsOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(6),
  boxShadow: theme.shadows[10],
  minWidth: 400,
  textAlign: 'center',
}));

const StatRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const MainTab: React.FC = () => {
  const { currentSession, startSession, updateSession, endSession, clearCurrentSession, textSources, activeTextSourceId, isTypingFieldActive, setTypingFieldActive, settings, getNextSessionId, updateTextSource } = useAppStore();
  const [mode, setMode] = useState<'time' | 'characters' | 'free'>('time');
  const [targetValue, setTargetValue] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [errors, setErrors] = useState<Set<number>>(new Set());
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [showCompletionOverlay, setShowCompletionOverlay] = useState(false);
  const [isMouseInsideTypingField, setIsMouseInsideTypingField] = useState(false);
  const [showSaveMessage, setShowSaveMessage] = useState(false);
  const [completedSessionStats, setCompletedSessionStats] = useState<{
    time: number;
    characters: number;
    accuracy: number;
    wpm: number;
  } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lastKeyTimeRef = useRef<number>(0);
  const sessionStartTimeRef = useRef<number>(0);
  const [checkpointBaseTime, setCheckpointBaseTime] = useState<number>(0); // Base elapsed time from checkpoint
  const [displayTime, setDisplayTime] = useState<number>(0); // Current display time in seconds

  const activeText = textSources.find(t => t.id === activeTextSourceId)?.content || '';

  // Format time as MM:SS
  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const calculateWPM = useCallback((chars: number, timeMs: number): number => {
    if (timeMs === 0) return 0;
    const seconds = timeMs / 1000;
    return Math.round((chars * 12) / seconds);
  }, []);

  const calculateAccuracy = useCallback((correct: number, total: number): number => {
    if (total === 0) return 100;
    return Math.round((correct / total) * 100);
  }, []);

  const handleStop = useCallback(() => {
    if (currentSession && hasStartedTyping) {
      const endTime = new Date();
      const currentSessionElapsed = endTime.getTime() - sessionStartTimeRef.current;
      const totalTime = checkpointBaseTime + currentSessionElapsed;
      const wpm = calculateWPM(currentSession.correctChars, totalTime);
      const accuracy = currentSession.accuracy / 100; // Convert to 0-1 range
      const score = calculateScore(wpm, accuracy, currentSession.typedChars, settings.scoreK0, settings.scoreK1, settings.scoreK2);
      
      const finalSession: TypingSession = {
        ...currentSession,
        id: getNextSessionId(), // Assign permanent ID when completed
        endTime,
        wpm,
        score,
      };
      endSession(finalSession);
      
      // Show completion overlay with stats
      setCompletedSessionStats({
        time: Math.round(totalTime / 1000), // Convert to seconds
        characters: currentSession.typedChars,
        accuracy: currentSession.accuracy,
        wpm,
      });
      setShowCompletionOverlay(true);
    }
    
    setIsRunning(false);
    setTypingFieldActive(false);
    setHasStartedTyping(false);
    setCheckpointBaseTime(0); // Reset checkpoint base time
    setDisplayTime(0); // Reset display time
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [currentSession, hasStartedTyping, checkpointBaseTime, calculateWPM, endSession, setTypingFieldActive, settings.scoreK0, settings.scoreK1, settings.scoreK2, getNextSessionId]);

  useEffect(() => {
    if (isRunning && hasStartedTyping && mode === 'time') {
      intervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const newProgress = (elapsed / targetValue) * 100;
        setProgress(Math.min(newProgress, 100));
        
        if (elapsed >= targetValue) {
          handleStop();
        }
      }, 100);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, hasStartedTyping, mode, targetValue, handleStop]);

  // Update display time every second
  useEffect(() => {
    let timeUpdateInterval: NodeJS.Timeout | null = null;
    
    if (isRunning && hasStartedTyping) {
      timeUpdateInterval = setInterval(() => {
        const currentSessionElapsed = Date.now() - sessionStartTimeRef.current;
        const totalElapsedMs = checkpointBaseTime + currentSessionElapsed;
        setDisplayTime(Math.floor(totalElapsedMs / 1000));
      }, 1000);
    } else {
      setDisplayTime(Math.floor(checkpointBaseTime / 1000));
    }
    
    return () => {
      if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
      }
    };
  }, [isRunning, hasStartedTyping, checkpointBaseTime]);

  const handleStart = () => {
    // Load checkpoint if in free mode and checkpoint exists
    if (mode === 'free' && activeTextSourceId) {
      const activeSource = textSources.find(source => source.id === activeTextSourceId);
      if (activeSource?.freeCheckpoint) {
        setCurrentIndex(activeSource.freeCheckpoint.position);
        setErrors(new Set(activeSource.freeCheckpoint.errors));
        setTypedText(activeText.substring(0, activeSource.freeCheckpoint.position));
        setProgress((activeSource.freeCheckpoint.position / activeText.length) * 100);
        
        // Set base time from checkpoint - timer will continue from this point
        const checkpointElapsedTime = activeSource.freeCheckpoint.elapsedTime || 0;
        setCheckpointBaseTime(checkpointElapsedTime);
      } else {
        // Reset base time if no checkpoint
        setCheckpointBaseTime(0);
      }
    } else {
      // Reset base time for non-free modes
      setCheckpointBaseTime(0);
    }

    const newSession: TypingSession = {
      id: 'temp-' + Date.now(), // Temporary ID during typing
      startTime: new Date(),
      mode,
      targetValue,
      text: activeText,
      typedChars: mode === 'free' && activeTextSourceId ? 
        (textSources.find(source => source.id === activeTextSourceId)?.freeCheckpoint?.position || 0) : 0,
      correctChars: mode === 'free' && activeTextSourceId ? 
        (textSources.find(source => source.id === activeTextSourceId)?.freeCheckpoint?.position || 0) - 
        (textSources.find(source => source.id === activeTextSourceId)?.freeCheckpoint?.errors.length || 0) : 0,
      incorrectChars: mode === 'free' && activeTextSourceId ? 
        (textSources.find(source => source.id === activeTextSourceId)?.freeCheckpoint?.errors.length || 0) : 0,
      wpm: 0,
      accuracy: 100,
      keyPresses: [],
    };
    
    startSession(newSession);
    setIsRunning(true);
    if (mode !== 'free' || !activeTextSourceId || !textSources.find(source => source.id === activeTextSourceId)?.freeCheckpoint) {
      setProgress(0);
      setTypedText('');
      setCurrentIndex(0);
      setErrors(new Set());
    }
    // Set session start time for all modes
    sessionStartTimeRef.current = Date.now();
    setHasStartedTyping(false);
    setTypingFieldActive(true);
    setShowCompletionOverlay(false);
  };


  const handleKeyPress = (key: string) => {
    // Check against original text length without padding characters
    const originalTextLength = activeText.replace(new RegExp(TYPING_PADDING_CHAR, 'g'), '').length;
    const currentNonPaddingIndex = typedText.length; // typedText doesn't include padding chars
    
    if (!isRunning || !currentSession || currentNonPaddingIndex >= originalTextLength) return;
    
    // Start timer on first character typed
    if (!hasStartedTyping) {
      setHasStartedTyping(true);
      startTimeRef.current = Date.now();
      lastKeyTimeRef.current = Date.now();
      sessionStartTimeRef.current = Date.now();
    }
    
    const currentTime = Date.now();
    const timeSinceLastKey = currentTime - lastKeyTimeRef.current;
    lastKeyTimeRef.current = currentTime;
    
    const expectedChar = activeText[currentIndex];
    const isCorrect = key === expectedChar;
    
    const keyPress: KeyPress = {
      char: key,
      timestamp: currentTime,
      correct: isCorrect,
      timeSinceLastKey,
    };
    
    // Calculate total elapsed time including checkpoint base time
    const currentSessionElapsed = currentTime - sessionStartTimeRef.current;
    const totalElapsedTime = checkpointBaseTime + currentSessionElapsed;
    
    const updatedSession: TypingSession = {
      ...currentSession,
      typedChars: currentSession.typedChars + 1,
      correctChars: isCorrect ? currentSession.correctChars + 1 : currentSession.correctChars,
      incorrectChars: !isCorrect ? currentSession.incorrectChars + 1 : currentSession.incorrectChars,
      keyPresses: [...currentSession.keyPresses, keyPress],
      wpm: hasStartedTyping ? calculateWPM(currentSession.correctChars + (isCorrect ? 1 : 0), totalElapsedTime) : 0,
      accuracy: calculateAccuracy(
        currentSession.correctChars + (isCorrect ? 1 : 0),
        currentSession.typedChars + 1
      ),
    };
    
    updateSession(updatedSession);
    
    if (!isCorrect) {
      setErrors(new Set([...errors, currentIndex]));
    }
    
    setTypedText(typedText + key);
    let nextIndex = currentIndex + 1;
    
    // Skip padding characters
    while (nextIndex < activeText.length && activeText[nextIndex] === TYPING_PADDING_CHAR) {
      nextIndex++;
    }
    
    setCurrentIndex(nextIndex);
    
    if (mode === 'characters') {
      // Count only non-padding characters for progress
      const nonPaddingCount = typedText.length + 1;
      const newProgress = (nonPaddingCount / targetValue) * 100;
      setProgress(Math.min(newProgress, 100));
      
      if (nonPaddingCount >= targetValue) {
        handleStop();
      }
    } else if (mode === 'free') {
      // Count only non-padding characters for progress
      const totalNonPadding = activeText.replace(new RegExp(TYPING_PADDING_CHAR, 'g'), '').length;
      const nonPaddingCount = typedText.length + 1;
      const newProgress = (nonPaddingCount / totalNonPadding) * 100;
      setProgress(Math.min(newProgress, 100));
      
      // Check completion against original text length (not including padding)
      if (nonPaddingCount >= totalNonPadding) {
        handleStop();
      }
    }
  };

  // Checkpoint functionality for free mode
  const handleSaveCheckpoint = useCallback(() => {
    if (mode === 'free' && activeTextSourceId && isRunning && hasStartedTyping) {
      const currentTime = Date.now();
      const currentSessionElapsed = currentTime - sessionStartTimeRef.current;
      const totalElapsedTime = checkpointBaseTime + currentSessionElapsed;
      
      const checkpoint = {
        position: currentIndex,
        errors: Array.from(errors),
        timestamp: new Date(),
        elapsedTime: totalElapsedTime,
      };
      updateTextSource(activeTextSourceId, { freeCheckpoint: checkpoint });
      
      // Show save confirmation message
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    }
  }, [mode, activeTextSourceId, isRunning, hasStartedTyping, currentIndex, errors, checkpointBaseTime, updateTextSource]);

  const handleLoadCheckpoint = useCallback(() => {
    if (mode === 'free' && activeTextSourceId && isRunning) {
      const activeSource = textSources.find(source => source.id === activeTextSourceId);
      if (activeSource?.freeCheckpoint) {
        setCurrentIndex(activeSource.freeCheckpoint.position);
        setErrors(new Set(activeSource.freeCheckpoint.errors));
        setTypedText(activeText.substring(0, activeSource.freeCheckpoint.position));
        setProgress((activeSource.freeCheckpoint.position / activeText.length) * 100);
        
        // Set base time from checkpoint and reset session start to current time
        const checkpointElapsedTime = activeSource.freeCheckpoint.elapsedTime || 0;
        setCheckpointBaseTime(checkpointElapsedTime);
        sessionStartTimeRef.current = Date.now();
        
        // Update current session to reflect checkpoint state
        if (currentSession) {
          const updatedSession: TypingSession = {
            ...currentSession,
            typedChars: activeSource.freeCheckpoint.position,
            correctChars: activeSource.freeCheckpoint.position - activeSource.freeCheckpoint.errors.length,
            incorrectChars: activeSource.freeCheckpoint.errors.length,
          };
          updateSession(updatedSession);
        }
      }
    }
  }, [mode, activeTextSourceId, textSources, activeText, isRunning, currentSession, updateSession]);

  // Keyboard event handler for Ctrl and Alt keys
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (mode === 'free' && isTypingFieldActive) {
        if (event.ctrlKey && !event.repeat) {
          event.preventDefault();
          handleSaveCheckpoint();
        } else if (event.altKey && !event.repeat) {
          event.preventDefault();
          handleLoadCheckpoint();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mode, isTypingFieldActive, handleSaveCheckpoint, handleLoadCheckpoint]);

  return (
    <MainContainer>
      <ControlPanel
        mode={mode}
        onModeChange={setMode}
        targetValue={targetValue}
        onTargetValueChange={setTargetValue}
        isRunning={isRunning}
        showSaveMessage={showSaveMessage}
      />
      
      <ContentArea>
        <MetricsContainer elevation={0}>
          <MetricItem>
            <Typography variant="h6" color="info.main">
              {formatTime(displayTime)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Time
            </Typography>
          </MetricItem>

          <MetricItem>
            <Typography variant="h6" color="primary">
              {currentSession?.typedChars || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Characters
            </Typography>
          </MetricItem>
          
          <MetricItem>
            <Typography variant="h6" color="success.main">
              {currentSession?.accuracy || 100}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accuracy
            </Typography>
          </MetricItem>
          
          <MetricItem>
            <Typography variant="h6" color="secondary">
              {currentSession?.wpm || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              WPM
            </Typography>
          </MetricItem>
        </MetricsContainer>
        
        <ProgressContainer>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 24, borderRadius: 1 }}
          />
          <Typography
            variant="body2"
            sx={{
              position: 'relative',
              top: -20,
              textAlign: 'center',
              fontWeight: 600,
            }}
          >
            {Math.round(progress)}%
          </Typography>
        </ProgressContainer>
        
        <TypingArea
          text={activeText}
          currentIndex={currentIndex}
          errors={errors}
          onKeyPress={handleKeyPress}
          isRunning={isRunning}
          isActive={isTypingFieldActive}
          onActivate={() => {
            // Only activate if mouse is inside typing field
            if (isMouseInsideTypingField) {
              handleStart();
            }
          }}
          onDeactivate={() => setTypingFieldActive(false)}
          onMouseEnter={() => setIsMouseInsideTypingField(true)}
          onMouseLeave={() => setIsMouseInsideTypingField(false)}
          onReset={() => {
            // Reset entire typing run
            setTypedText('');
            setCurrentIndex(0);
            setErrors(new Set());
            setProgress(0);
            setHasStartedTyping(false);
            setIsRunning(false);
            setShowCompletionOverlay(false);
            setCheckpointBaseTime(0); // Reset checkpoint base time
            setDisplayTime(0); // Reset display time
            
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            
            // Clear current session entirely
            clearCurrentSession();
          }}
        />
      </ContentArea>
      
      <Modal
        open={showCompletionOverlay}
        onClose={() => setShowCompletionOverlay(false)}
        closeAfterTransition
        onKeyDown={() => setShowCompletionOverlay(false)}
      >
        <Fade in={showCompletionOverlay}>
          <StatsOverlay>
            <Typography variant="h4" gutterBottom color="primary">
              Typing Run Complete!
            </Typography>
            
            {completedSessionStats && (
              <>
                <StatRow>
                  <Typography variant="h6">Time:</Typography>
                  <Typography variant="h6">{completedSessionStats.time}s</Typography>
                </StatRow>
                
                <StatRow>
                  <Typography variant="h6">Characters:</Typography>
                  <Typography variant="h6">{completedSessionStats.characters}</Typography>
                </StatRow>
                
                <StatRow>
                  <Typography variant="h6">Accuracy:</Typography>
                  <Typography variant="h6" color={completedSessionStats.accuracy >= 95 ? 'success.main' : 'inherit'}>
                    {completedSessionStats.accuracy}%
                  </Typography>
                </StatRow>
                
                <StatRow>
                  <Typography variant="h6">WPM:</Typography>
                  <Typography variant="h6" color="secondary">
                    {completedSessionStats.wpm}
                  </Typography>
                </StatRow>
              </>
            )}
            
            <Typography variant="body2" sx={{ mt: 4 }} color="text.secondary">
              Press any key to start a new run
            </Typography>
          </StatsOverlay>
        </Fade>
      </Modal>
    </MainContainer>
  );
};

export default MainTab;