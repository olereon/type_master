import React, { useEffect, useRef } from 'react';
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
    transition: 'all 0.1s ease',
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

  useEffect(() => {
    // Scroll to keep current character in view
    const currentChar = document.querySelector('[data-status="current"]');
    if (currentChar && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const charRect = currentChar.getBoundingClientRect();
      
      if (charRect.bottom > containerRect.bottom - 50) {
        containerRef.current.scrollTop += charRect.bottom - containerRect.bottom + 50;
      }
    }
  }, [currentIndex]);

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

  const renderText = () => {
    return text.split('').map((char, index) => {
      let status: 'pending' | 'correct' | 'incorrect' | 'current' = 'pending';
      
      if (index === currentIndex) {
        status = 'current';
      } else if (index < currentIndex) {
        status = errors.has(index) ? 'incorrect' : 'correct';
      }
      
      return (
        <Character
          key={index}
          status={status}
          data-status={status}
          textColor={settings.textColor}
        >
          {char}
        </Character>
      );
    });
  };

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
            To start typing press <span className="primary">Enter</span>
          </OverlayText>
        </InactiveOverlay>
      )}
    </TextContainer>
  );
};

export default TypingArea;