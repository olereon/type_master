import React from 'react';
import { Box, ToggleButton, ToggleButtonGroup, Button, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

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


interface ControlPanelProps {
  mode: 'time' | 'characters';
  onModeChange: (mode: 'time' | 'characters') => void;
  targetValue: number;
  onTargetValueChange: (value: number) => void;
  isRunning: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onModeChange,
  targetValue,
  onTargetValueChange,
  isRunning,
}) => {
  const timeValues = [5, 10, 20, 30, 60];
  const charValues = [50, 100, 200, 300, 500];

  const handleModeChange = (newMode: 'time' | 'characters') => {
    if (newMode && !isRunning) {
      onModeChange(newMode);
      // Set default value for the new mode
      onTargetValueChange(newMode === 'time' ? 30 : 100);
    }
  };

  const values = mode === 'time' ? timeValues : charValues;

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
            SEC
          </ModeToggle>
          <ModeToggle value="characters" disabled={isRunning}>
            NUM
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
      </ButtonGroup>
    </PanelContainer>
  );
};

export default ControlPanel;