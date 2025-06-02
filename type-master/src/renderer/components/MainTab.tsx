import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, LinearProgress, Paper, Modal, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import ControlPanel from './ControlPanel';
import TypingArea from './TypingArea';
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

  const activeText = textSources.find(t => t.id === activeTextSourceId)?.content || '';

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
      const totalTime = endTime.getTime() - sessionStartTimeRef.current;
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
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [currentSession, hasStartedTyping, calculateWPM, endSession, setTypingFieldActive, settings.scoreK0, settings.scoreK1, settings.scoreK2]);

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

  const handleStart = () => {
    // Load checkpoint if in free mode and checkpoint exists
    if (mode === 'free' && activeTextSourceId) {
      const activeSource = textSources.find(source => source.id === activeTextSourceId);
      if (activeSource?.freeCheckpoint) {
        setCurrentIndex(activeSource.freeCheckpoint.position);
        setErrors(new Set(activeSource.freeCheckpoint.errors));
        setTypedText(activeText.substring(0, activeSource.freeCheckpoint.position));
        setProgress((activeSource.freeCheckpoint.position / activeText.length) * 100);
      }
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
    setHasStartedTyping(false);
    setTypingFieldActive(true);
    setShowCompletionOverlay(false);
    sessionStartTimeRef.current = Date.now();
  };


  const handleKeyPress = (key: string) => {
    if (!isRunning || !currentSession || currentIndex >= activeText.length) return;
    
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
    
    const updatedSession: TypingSession = {
      ...currentSession,
      typedChars: currentSession.typedChars + 1,
      correctChars: isCorrect ? currentSession.correctChars + 1 : currentSession.correctChars,
      incorrectChars: !isCorrect ? currentSession.incorrectChars + 1 : currentSession.incorrectChars,
      keyPresses: [...currentSession.keyPresses, keyPress],
      wpm: hasStartedTyping ? calculateWPM(currentSession.correctChars + (isCorrect ? 1 : 0), currentTime - startTimeRef.current) : 0,
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
    setCurrentIndex(currentIndex + 1);
    
    if (mode === 'characters') {
      const newProgress = ((currentIndex + 1) / targetValue) * 100;
      setProgress(Math.min(newProgress, 100));
      
      if (currentIndex + 1 >= targetValue) {
        handleStop();
      }
    } else if (mode === 'free') {
      const newProgress = ((currentIndex + 1) / activeText.length) * 100;
      setProgress(Math.min(newProgress, 100));
      
      if (currentIndex + 1 >= activeText.length) {
        handleStop();
      }
    }
  };

  // Checkpoint functionality for free mode
  const handleSaveCheckpoint = useCallback(() => {
    if (mode === 'free' && activeTextSourceId && isRunning) {
      const checkpoint = {
        position: currentIndex,
        errors: Array.from(errors),
        timestamp: new Date(),
      };
      updateTextSource(activeTextSourceId, { freeCheckpoint: checkpoint });
      
      // Show save confirmation message
      setShowSaveMessage(true);
      setTimeout(() => setShowSaveMessage(false), 3000);
    }
  }, [mode, activeTextSourceId, isRunning, currentIndex, errors, updateTextSource]);

  const handleLoadCheckpoint = useCallback(() => {
    if (mode === 'free' && activeTextSourceId && isRunning) {
      const activeSource = textSources.find(source => source.id === activeTextSourceId);
      if (activeSource?.freeCheckpoint) {
        setCurrentIndex(activeSource.freeCheckpoint.position);
        setErrors(new Set(activeSource.freeCheckpoint.errors));
        setTypedText(activeText.substring(0, activeSource.freeCheckpoint.position));
        setProgress((activeSource.freeCheckpoint.position / activeText.length) * 100);
        
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