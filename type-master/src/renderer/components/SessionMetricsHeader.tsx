import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import SpeedIcon from '@mui/icons-material/Speed';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { SessionMetrics } from '../../types';

const MetricsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  alignItems: 'center',
}));

const MetricItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

interface SessionMetricsHeaderProps {
  metrics: SessionMetrics;
}

const SessionMetricsHeader: React.FC<SessionMetricsHeaderProps> = ({ metrics }) => {
  return (
    <MetricsContainer>
      <MetricItem>
        <KeyboardIcon fontSize="small" color="primary" />
        <Typography variant="body2" color="text.secondary">
          Runs: {metrics.totalRuns}
        </Typography>
      </MetricItem>
      
      <MetricItem>
        <TextFieldsIcon fontSize="small" color="primary" />
        <Typography variant="body2" color="text.secondary">
          Characters: {metrics.totalCharacters.toLocaleString()} / Words: {metrics.totalWords.toLocaleString()}
        </Typography>
      </MetricItem>
      
      <MetricItem>
        <SpeedIcon fontSize="small" color="primary" />
        <Typography variant="body2" color="text.secondary">
          Max: {metrics.maxWPM} WPM | Avg: {metrics.avgWPM} WPM
        </Typography>
      </MetricItem>
    </MetricsContainer>
  );
};

export default SessionMetricsHeader;