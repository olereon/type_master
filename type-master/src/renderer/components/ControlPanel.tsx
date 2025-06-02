import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Button, Paper, Tooltip, Typography, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAppStore } from '../store/useAppStore';

const PanelContainer = styled(Paper)(({ theme }) => ({
  width: 180,
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const ModeToggle = styled(ToggleButton)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1),
  fontWeight: 600,
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

const ValueButton = styled(Button)(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  padding: theme.spacing(1),
  fontSize: '1.1rem',
  fontWeight: 600,
}));

const FreeButton = styled(Button)(({ theme }) => ({
  width: '100%',
  minWidth: 0,
  padding: theme.spacing(1.5),
  fontSize: '1.2rem',
  fontWeight: 700,
  marginTop: theme.spacing(1),
  background: 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #FF8E8E 30%, #5FDAD0 90%)',
  },
  '&:disabled': {
    background: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));


interface ControlPanelProps {
  mode: 'time' | 'characters' | 'free';
  onModeChange: (mode: 'time' | 'characters' | 'free') => void;
  targetValue: number;
  onTargetValueChange: (value: number) => void;
  isRunning: boolean;
  showSaveMessage?: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onModeChange,
  targetValue,
  onTargetValueChange,
  isRunning,
  showSaveMessage = false,
}) => {
  const timeValues = [5, 10, 20, 30, 60, 120, 300];
  const charValues = [50, 100, 200, 300, 500, 1000, 2500];

  const { textSources, activeTextSourceId } = useAppStore();
  const activeTextSource = textSources.find(source => source.id === activeTextSourceId);
  const isFreeEligible = activeTextSource && activeTextSource.content.length >= 5000;

  const handleModeChange = (newMode: 'time' | 'characters') => {
    if (newMode && !isRunning) {
      onModeChange(newMode);
      // Set default value for the new mode
      onTargetValueChange(newMode === 'time' ? 30 : 100);
    }
  };

  const handleFreeMode = () => {
    if (isFreeEligible && !isRunning) {
      onModeChange('free');
      onTargetValueChange(0); // No target for free mode
    }
  };

  const values = mode === 'time' ? timeValues : mode === 'characters' ? charValues : [];

  return (
    <PanelContainer elevation={0}>
      <ButtonGroup>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, value) => value && handleModeChange(value)}
          orientation="vertical"
          fullWidth
        >
          <ModeToggle value="time" disabled={isRunning}>
            TIME
          </ModeToggle>
          <ModeToggle value="characters" disabled={isRunning}>
            CHAR
          </ModeToggle>
        </ToggleButtonGroup>
      </ButtonGroup>

      <ButtonGroup>
        {values.map((value) => (
          <ValueButton
            key={value}
            variant={targetValue === value ? 'contained' : 'outlined'}
            color="primary"
            onClick={() => !isRunning && onTargetValueChange(value)}
            disabled={isRunning}
          >
            {value}
          </ValueButton>
        ))}
        
        <Tooltip 
          title={isFreeEligible ? "Free typing mode for texts with 5000+ characters" : "Text must have at least 5000 characters to enable Free mode"}
          placement="right"
        >
          <span>
            <FreeButton
              variant="contained"
              onClick={handleFreeMode}
              disabled={isRunning || !isFreeEligible}
            >
              FREE
            </FreeButton>
          </span>
        </Tooltip>
      </ButtonGroup>
      
      {/* Save confirmation message */}
      <Fade in={showSaveMessage}>
        <Typography 
          variant="caption" 
          sx={{ 
            textAlign: 'center',
            color: 'success.main',
            fontWeight: 600,
            marginTop: 1,
            minHeight: 20
          }}
        >
          Saving complete
        </Typography>
      </Fade>
    </PanelContainer>
  );
};

export default ControlPanel;