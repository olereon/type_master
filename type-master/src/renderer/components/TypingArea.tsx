import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppStore } from '../store/useAppStore';
import { getKeyRow, getRowColor } from '../utils/keyMappings';

const TypingWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

const TextContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  overflow: 'auto',
  position: 'relative',
  cursor: 'text',
  userSelect: 'none',
  width: '100%', // Will be constrained by parent
  boxSizing: 'border-box', // Include padding in width calculation
  margin: '0 auto', // Center the container when it's less than full width
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
    whiteSpace: 'pre', // Use 'pre' to preserve exact spacing and prevent wrapping
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    display: 'block',
  })
);

const Character = styled('span')<{ 
  status: 'pending' | 'correct' | 'incorrect' | 'current';
  textColor?: string;
  isSpace?: boolean;
  cursorType?: 'block' | 'box' | 'line' | 'underline';
  rowColor?: string;
  enableRowColors?: boolean;
}>(
  ({ theme, status, textColor, isSpace, cursorType, rowColor, enableRowColors }) => ({
    position: 'relative',
    color:
      isSpace 
        ? 'transparent' // Make space character invisible so we can show symbol overlay
        : status === 'pending'
        ? enableRowColors && rowColor 
          ? rowColor 
          : textColor || theme.palette.text.primary
        : status === 'correct'
        ? theme.palette.grey[600]
        : status === 'incorrect'
        ? theme.palette.error.main
        : enableRowColors && rowColor 
        ? rowColor 
        : textColor || theme.palette.text.primary,
    backgroundColor:
      status === 'current' && cursorType === 'block'
        ? theme.palette.action.selected
        : 'transparent',
    borderRadius: 2,
    transition: status === 'current' ? 'background-color 0.1s ease' : 'none', // Only animate current character
    willChange: status === 'current' ? 'background-color' : 'auto', // Optimize GPU rendering
  })
);

const WhitespaceSymbol = styled('span')<{
  status: 'pending' | 'correct' | 'incorrect' | 'current';
  showWhitespace: boolean;
  textColor?: string;
  rowColor?: string;
  enableRowColors?: boolean;
}>(
  ({ theme, status, showWhitespace, textColor, rowColor, enableRowColors }) => ({
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    color:
      status === 'incorrect'
        ? theme.palette.error.main
        : showWhitespace
        ? status === 'correct'
          ? theme.palette.grey[600]
          : enableRowColors && rowColor 
          ? rowColor 
          : textColor || theme.palette.text.primary
        : 'transparent',
    pointerEvents: 'none',
    lineHeight: 1, // Ensure the symbol doesn't inherit line height
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '1em', // Height relative to font size
  })
);

const CursorOverlay = styled('span')<{
  cursorType: 'block' | 'box' | 'line' | 'underline';
  primaryColor: string;
}>(
  ({ cursorType, primaryColor }) => ({
    position: 'absolute',
    pointerEvents: 'none',
    ...(cursorType === 'box' && {
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      border: `2px solid ${primaryColor}`,
      borderRadius: 2,
      boxSizing: 'border-box',
    }),
    ...(cursorType === 'line' && {
      left: 0,
      top: 0,
      width: '2px',
      height: '100%',
      backgroundColor: primaryColor,
    }),
    ...(cursorType === 'underline' && {
      left: 0,
      bottom: 0,
      width: '100%',
      height: '2px',
      backgroundColor: primaryColor,
    }),
  })
);

export const TYPING_PADDING_CHAR = '·'; // Export for use in MainTab

// Utility function to process text with padding
export const processTextWithPadding = (text: string, charsPerLine: number): string => {
  const lines: string[] = [];
  const words = text.match(/\S+\s*/g) || [];
  
  let currentLine = '';
  let currentLineLength = 0;
  
  for (const word of words) {
    if (currentLineLength + word.length <= charsPerLine) {
      currentLine += word;
      currentLineLength += word.length;
    } else {
      if (currentLine) {
        const padding = TYPING_PADDING_CHAR.repeat(charsPerLine - currentLineLength);
        lines.push(currentLine + padding);
      }
      currentLine = word;
      currentLineLength = word.length;
    }
  }
  
  if (currentLine) {
    const padding = TYPING_PADDING_CHAR.repeat(charsPerLine - currentLineLength);
    lines.push(currentLine + padding);
  }
  
  return lines.join('');
};

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
  lines: string[]; // Array of padded lines
  startLineIndex: number; // Index of first visible line in the full text
  currentLineIndex: number; // Current line index within visible window
  currentCharIndex: number; // Current character index within current line
  totalStartIndex: number; // Absolute start index in original text
  paddingChar: string; // Character used for padding
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
  const PADDING_CHAR = TYPING_PADDING_CHAR; // Use exported constant
  const MAX_VISIBLE_LINES = 8;
  const MAX_TOTAL_CHARS = 512;
  const MAX_ABSOLUTE_WIDTH = 1800; // Maximum width constraint in pixels
  const WIDTH_PERCENTAGE = 0.9; // Use 90% of available width
  
  // State to track current optimal width
  const [optimalWidth, setOptimalWidth] = useState(() => {
    const windowWidth = window.innerWidth;
    const percentageWidth = windowWidth * WIDTH_PERCENTAGE;
    return Math.min(percentageWidth, MAX_ABSOLUTE_WIDTH);
  });
  
  // Listen for window resize to update optimal width
  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      const percentageWidth = windowWidth * WIDTH_PERCENTAGE;
      setOptimalWidth(Math.min(percentageWidth, MAX_ABSOLUTE_WIDTH));
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Calculate characters per line based on responsive width and font size
  const calculateCharsPerLine = useCallback(() => {
    // Create a temporary element to measure character width
    const testElement = document.createElement('span');
    testElement.style.fontFamily = settings.fontFamily;
    testElement.style.fontSize = `${settings.fontSize}px`;
    testElement.style.fontStyle = settings.fontStyle;
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    testElement.style.whiteSpace = 'pre';
    testElement.style.letterSpacing = '0.05em'; // Match TextDisplay letterSpacing
    
    // Use 'W' as it's typically the widest character in monospace fonts
    testElement.textContent = 'W';
    
    document.body.appendChild(testElement);
    const maxCharWidth = testElement.offsetWidth;
    document.body.removeChild(testElement);
    
    // Use responsive width minus padding (24px on each side = 48px total)
    const availableWidth = optimalWidth - 48;
    const charsPerLine = Math.floor(availableWidth / maxCharWidth);
    
    // Ensure we don't exceed the max chars constraint
    return Math.min(charsPerLine, Math.floor(MAX_TOTAL_CHARS / MAX_VISIBLE_LINES));
  }, [settings.fontFamily, settings.fontSize, settings.fontStyle, optimalWidth]);

  useEffect(() => {
    if (containerRef.current && isActive) {
      containerRef.current.focus();
    }
  }, [isActive]);

  // Process text into padded lines
  const processedLines = useMemo(() => {
    const charsPerLine = calculateCharsPerLine();
    const lines: string[] = [];
    const words = text.match(/\S+\s*/g) || []; // Match words with trailing whitespace
    
    let currentLine = '';
    let currentLineLength = 0;
    let totalCharsProcessed = 0;
    
    for (const word of words) {
      // Check if we've reached the total character limit
      if (totalCharsProcessed >= MAX_TOTAL_CHARS) {
        break;
      }
      
      // Check if word fits in current line
      if (currentLineLength + word.length <= charsPerLine) {
        currentLine += word;
        currentLineLength += word.length;
        totalCharsProcessed += word.length;
      } else {
        // Pad current line and start new one
        if (currentLine) {
          const padding = PADDING_CHAR.repeat(charsPerLine - currentLineLength);
          lines.push(currentLine + padding);
          totalCharsProcessed += padding.length;
        }
        
        // Check if we've reached the line limit
        if (lines.length >= MAX_VISIBLE_LINES) {
          break;
        }
        
        // If word is longer than charsPerLine, truncate it
        if (word.length > charsPerLine) {
          currentLine = word.substring(0, charsPerLine);
          currentLineLength = charsPerLine;
        } else {
          currentLine = word;
          currentLineLength = word.length;
        }
        totalCharsProcessed += currentLineLength;
      }
    }
    
    // Handle last line
    if (currentLine && lines.length < MAX_VISIBLE_LINES) {
      const padding = PADDING_CHAR.repeat(Math.max(0, charsPerLine - currentLineLength));
      lines.push(currentLine + padding);
    }
    
    return lines;
  }, [text, calculateCharsPerLine]);

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
    // Map currentIndex to line and character position
    let charCount = 0;
    let targetLineIndex = 0;
    let targetCharIndex = 0;
    
    // Find which line contains the current index
    for (let i = 0; i < processedLines.length; i++) {
      const line = processedLines[i];
      const realChars = line.replace(new RegExp(`${PADDING_CHAR}+$`), ''); // Remove padding
      
      if (charCount + realChars.length > currentIndex) {
        targetLineIndex = i;
        targetCharIndex = currentIndex - charCount;
        break;
      }
      charCount += realChars.length;
    }
    
    // Calculate window start based on current position
    let startLineIndex = Math.max(0, targetLineIndex - MAX_VISIBLE_LINES + 3);
    
    // When cursor is on 2nd to last visible line, shift window up
    const currentVisibleLine = targetLineIndex - startLineIndex;
    if (currentVisibleLine >= MAX_VISIBLE_LINES - 2) {
      startLineIndex = Math.min(
        processedLines.length - MAX_VISIBLE_LINES,
        targetLineIndex - MAX_VISIBLE_LINES + 3
      );
    }
    
    // Get visible lines
    const visibleLines = processedLines.slice(
      startLineIndex,
      Math.min(startLineIndex + MAX_VISIBLE_LINES, processedLines.length)
    );
    
    // Calculate total start index for absolute positioning
    let totalStartIndex = 0;
    for (let i = 0; i < startLineIndex; i++) {
      const realChars = processedLines[i].replace(new RegExp(`${PADDING_CHAR}+$`), '');
      totalStartIndex += realChars.length;
    }
    
    return {
      lines: visibleLines,
      startLineIndex,
      currentLineIndex: targetLineIndex - startLineIndex,
      currentCharIndex: targetCharIndex,
      totalStartIndex,
      paddingChar: PADDING_CHAR
    };
  }, [processedLines, currentIndex]);
  
  const renderText = () => {
    let absoluteIndex = textWindow.totalStartIndex;
    
    return textWindow.lines.map((line, lineIndex) => {
      const lineChars = line.split('').map((char, charIndex) => {
        const isPadding = char === PADDING_CHAR;
        const isCurrentLine = lineIndex === textWindow.currentLineIndex;
        const isCurrentChar = isCurrentLine && charIndex === textWindow.currentCharIndex;
        const charAbsoluteIndex = absoluteIndex;
        
        let status: 'pending' | 'correct' | 'incorrect' | 'current' = 'pending';
        
        if (isCurrentChar) {
          status = 'current';
        } else if (!isPadding && charAbsoluteIndex < currentIndex) {
          status = errors.has(charAbsoluteIndex) ? 'incorrect' : 'correct';
        }
        
        const isWhitespace = char === ' ';
        
        // Get keyboard row color for this character
        const keyRow = !isPadding ? getKeyRow(char, settings.keyboardLayout) : null;
        const rowColor = keyRow ? getRowColor(keyRow) : undefined;
        
        // Only increment absoluteIndex for non-padding characters
        if (!isPadding) {
          absoluteIndex++;
        }
        
        return (
          <Character
            key={`${lineIndex}-${charIndex}`}
            status={isPadding ? 'pending' : status}
            data-status={status === 'current' ? 'current' : undefined}
            textColor={settings.textColor}
            isSpace={isWhitespace}
            cursorType={settings.cursorType}
            rowColor={rowColor}
            enableRowColors={settings.enableKeyboardRowColors}
            style={{
              color: isPadding ? 'transparent' : undefined,
              backgroundColor: isPadding ? 'transparent' : undefined,
            }}
          >
            {/* Keep the original character for proper spacing */}
            {char}
            {/* Overlay whitespace symbol for spaces (not padding) */}
            {isWhitespace && !isPadding && (
              <WhitespaceSymbol
                status={status}
                showWhitespace={settings.showWhitespaceSymbols}
                textColor={settings.textColor}
                rowColor={rowColor}
                enableRowColors={settings.enableKeyboardRowColors}
              >
                {settings.whitespaceSymbol}
              </WhitespaceSymbol>
            )}
            {/* Cursor overlay for non-block cursors */}
            {status === 'current' && settings.cursorType !== 'block' && (
              <CursorOverlay
                cursorType={settings.cursorType}
                primaryColor={settings.primaryColor}
              />
            )}
          </Character>
        );
      });
      
      // No need to adjust absoluteIndex as we only count real characters
      
      return (
        <Box 
          key={lineIndex} 
          sx={{ 
            whiteSpace: 'pre',
            maxWidth: '100%',
            overflow: 'hidden',
            display: 'block'
          }}
        >
          {lineChars}
        </Box>
      );
    });
  };

  // Auto-scroll effect for windowed view
  useEffect(() => {
    const currentChar = document.querySelector('[data-status="current"]');
    if (currentChar && containerRef.current) {
      // Only scroll if the current character is near edges of viewport
      const rect = currentChar.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const relativeTop = rect.top - containerRect.top;
      const relativeBottom = containerRect.bottom - rect.bottom;
      
      // Scroll only if character is within 100px of top/bottom edges
      if (relativeTop < 100 || relativeBottom < 100) {
        currentChar.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }
  }, [textWindow.currentLineIndex, textWindow.currentCharIndex, currentIndex]);

  return (
    <TypingWrapper style={{ maxWidth: `${optimalWidth}px` }}>
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
    </TypingWrapper>
  );
};

export default TypingArea;