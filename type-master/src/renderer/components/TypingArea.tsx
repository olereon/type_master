import React, { useEffect, useRef, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppStore } from '../store/useAppStore';

const TextContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: 'auto',
  position: 'relative',
  cursor: 'text',
  userSelect: 'none',
  '&:focus': {
    outline: 'none',
  },
}));

const InactiveOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  textAlign: 'center',
  pointerEvents: 'none',
  zIndex: 10,
}));

const OverlayText = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 500,
  color: theme.palette.text.disabled,
  '& .primary': {
    color: theme.palette.primary.main,
    fontWeight: 600,
  },
}));

const TextDisplay = styled(Typography)<{ customFont?: string; customSize?: number; customStyle?: string }>(
  ({ customFont, customSize, customStyle }) => ({
    fontFamily: customFont || 'JetBrains Mono, monospace',
    fontSize: customSize || 20,
    fontStyle: customStyle || 'normal',
    fontWeight: customStyle === 'bold' ? 600 : 400,
    lineHeight: 1.8,
    letterSpacing: '0.05em',
    whiteSpace: 'pre-wrap',
  })
);

const Character = styled('span')<{ 
  status: 'pending' | 'correct' | 'incorrect' | 'current';
  textColor?: string;
}>(
  ({ theme, status, textColor }) => ({
    position: 'relative',
    color:
      status === 'pending'
        ? textColor || theme.palette.text.primary
        : status === 'correct'
        ? theme.palette.grey[600]
        : status === 'incorrect'
        ? theme.palette.error.main
        : textColor || theme.palette.text.primary,
    backgroundColor:
      status === 'current'
        ? theme.palette.action.selected
        : 'transparent',
    borderRadius: 2,
    transition: status === 'current' ? 'background-color 0.1s ease' : 'none', // Only animate current character
    willChange: status === 'current' ? 'background-color' : 'auto', // Optimize GPU rendering
  })
);

interface TypingAreaProps {
  text: string;
  currentIndex: number;
  errors: Set<number>;
  onKeyPress: (key: string) => void;
  isRunning: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  onReset: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

interface TextWindow {
  startIndex: number;
  endIndex: number;
  visibleText: string;
  offsetCurrentIndex: number;
}

const TypingArea: React.FC<TypingAreaProps> = ({
  text,
  currentIndex,
  errors,
  onKeyPress,
  isRunning,
  isActive,
  onActivate,
  onDeactivate,
  onReset,
  onMouseEnter,
  onMouseLeave,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useAppStore();

  useEffect(() => {
    if (containerRef.current && isActive) {
      containerRef.current.focus();
    }
  }, [isActive]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Enter key to activate
    if (e.key === 'Enter' && !isActive) {
      e.preventDefault();
      onActivate();
      return;
    }
    
    // Handle Alt key to reset and deactivate
    if (e.key === 'Alt') {
      e.preventDefault();
      onReset();
      onDeactivate();
      return;
    }
    
    // Only process character keys when active and running
    if (!isActive || !isRunning) return;
    
    e.preventDefault();
    
    if (e.key.length === 1) {
      onKeyPress(e.key);
    }
  };

  // Calculate text window for performance optimization
  const textWindow = useMemo((): TextWindow => {
    const lines = text.split('\n');
    const maxLines = 8;
    
    // Calculate which line the current character is on
    let currentLine = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      if (charCount + lines[i].length >= currentIndex) {
        currentLine = i;
        break;
      }
      charCount += lines[i].length + 1; // +1 for newline character
    }
    
    // Determine visible lines range
    let startLine = Math.max(0, currentLine - 3); // Show 3 lines before current
    let endLine = Math.min(lines.length - 1, startLine + maxLines - 1);
    
    // Adjust if we're near the end
    if (endLine - startLine < maxLines - 1) {
      startLine = Math.max(0, endLine - maxLines + 1);
    }
    
    // Calculate character indices
    let startIndex = 0;
    for (let i = 0; i < startLine; i++) {
      startIndex += lines[i].length + 1;
    }
    
    let endIndex = startIndex;
    for (let i = startLine; i <= endLine; i++) {
      endIndex += lines[i].length;
      if (i < endLine) endIndex += 1; // Add newline except for last line
    }
    
    const visibleText = text.substring(startIndex, endIndex);
    const offsetCurrentIndex = currentIndex - startIndex;
    
    return {
      startIndex,
      endIndex,
      visibleText,
      offsetCurrentIndex
    };
  }, [text, currentIndex]);
  
  const renderText = () => {
    return textWindow.visibleText.split('').map((char, relativeIndex) => {
      const absoluteIndex = textWindow.startIndex + relativeIndex;
      let status: 'pending' | 'correct' | 'incorrect' | 'current' = 'pending';
      
      if (relativeIndex === textWindow.offsetCurrentIndex) {
        status = 'current';
      } else if (absoluteIndex < currentIndex) {
        status = errors.has(absoluteIndex) ? 'incorrect' : 'correct';
      }
      
      return (
        <Character
          key={absoluteIndex}
          status={status}
          data-status={status === 'current' ? 'current' : undefined}
          textColor={settings.textColor}
        >
          {char}
        </Character>
      );
    });
  };

  // Auto-scroll effect for windowed view
  useEffect(() => {
    const currentChar = document.querySelector('[data-status="current"]');
    if (currentChar && containerRef.current) {
      currentChar.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [textWindow.offsetCurrentIndex, currentIndex]);

  return (
    <TextContainer
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <TextDisplay
        customFont={settings.fontFamily}
        customSize={settings.fontSize}
        customStyle={settings.fontStyle}
        style={{ 
          color: settings.textColor,
          filter: !isActive ? 'blur(4px)' : 'none',
          transition: 'filter 0.3s ease',
        }}
      >
        {renderText()}
      </TextDisplay>
      
      {!isActive && !isRunning && (
        <InactiveOverlay>
          <OverlayText>
            <div>Place the cursor inside the type area.</div>
            <div>To start typing press <span className="primary">Enter</span></div>
          </OverlayText>
        </InactiveOverlay>
      )}
    </TextContainer>
  );
};

export default TypingArea;