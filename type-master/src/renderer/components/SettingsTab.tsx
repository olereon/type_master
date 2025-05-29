import React from 'react';
import {
  Box,
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { HexColorPicker } from 'react-colorful';
import { useAppStore } from '../store/useAppStore';

const SettingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 800,
  margin: '0 auto',
}));

const SettingSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
}));

const SettingRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
  '&:last-child': {
    marginBottom: 0,
  },
}));

const ColorPickerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(4),
  marginTop: theme.spacing(2),
}));

const ColorPickerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const PreviewText = styled(Typography)<{ customFont: string; customSize: number; customStyle: string; customColor: string }>(
  ({ customFont, customSize, customStyle, customColor }) => ({
    fontFamily: customFont,
    fontSize: customSize,
    fontStyle: customStyle === 'italic' ? 'italic' : 'normal',
    fontWeight: customStyle === 'bold' ? 600 : 400,
    color: customColor,
    marginTop: 24,
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 4,
  })
);

const SettingsTab: React.FC = () => {
  const { settings, updateSettings } = useAppStore();

  const fontFamilies = [
    'JetBrains Mono',
    'Courier New',
    'Consolas',
    'Monaco',
    'Source Code Pro',
    'Fira Code',
    'Inter',
    'Roboto',
    'Arial',
    'Times New Roman',
  ];

  const handleResetSettings = () => {
    updateSettings({
      fontSize: 20,
      fontFamily: 'JetBrains Mono',
      fontStyle: 'normal',
      textColor: '#FFFFFF',
      primaryColor: '#4FC3F7',
      scoreK0: 50,
      scoreK1: 0.9,
      scoreK2: 10,
      sessionsForAverage: 50,
    });
  };

  return (
    <SettingsContainer>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>

      <SettingSection elevation={0}>
        <Typography variant="h6" gutterBottom>
          Font Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <SettingRow>
          <Typography>Font Size</Typography>
          <Box sx={{ width: 300 }}>
            <Slider
              value={settings.fontSize}
              onChange={(_, value) => updateSettings({ fontSize: value as number })}
              min={12}
              max={48}
              valueLabelDisplay="on"
              marks={[
                { value: 12, label: '12px' },
                { value: 24, label: '24px' },
                { value: 36, label: '36px' },
                { value: 48, label: '48px' },
              ]}
            />
          </Box>
        </SettingRow>

        <SettingRow>
          <Typography>Font Family</Typography>
          <FormControl sx={{ width: 300 }}>
            <Select
              value={settings.fontFamily}
              onChange={(e) => updateSettings({ fontFamily: e.target.value })}
            >
              {fontFamilies.map((font) => (
                <MenuItem key={font} value={font}>
                  {font}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </SettingRow>

        <SettingRow>
          <Typography>Font Style</Typography>
          <FormControl sx={{ width: 300 }}>
            <Select
              value={settings.fontStyle}
              onChange={(e) => updateSettings({ fontStyle: e.target.value as 'normal' | 'italic' | 'bold' })}
            >
              <MenuItem value="normal">Regular</MenuItem>
              <MenuItem value="italic">Italic</MenuItem>
              <MenuItem value="bold">Bold</MenuItem>
            </Select>
          </FormControl>
        </SettingRow>
      </SettingSection>

      <SettingSection elevation={0}>
        <Typography variant="h6" gutterBottom>
          Color Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <ColorPickerContainer>
          <ColorPickerWrapper>
            <Typography variant="body2" color="text.secondary">
              Text Color
            </Typography>
            <HexColorPicker
              color={settings.textColor}
              onChange={(color) => updateSettings({ textColor: color })}
            />
            <Typography variant="caption" align="center">
              {settings.textColor}
            </Typography>
          </ColorPickerWrapper>

          <ColorPickerWrapper>
            <Typography variant="body2" color="text.secondary">
              Primary Color
            </Typography>
            <HexColorPicker
              color={settings.primaryColor}
              onChange={(color) => updateSettings({ primaryColor: color })}
            />
            <Typography variant="caption" align="center">
              {settings.primaryColor}
            </Typography>
          </ColorPickerWrapper>
        </ColorPickerContainer>
      </SettingSection>

      <SettingSection elevation={0}>
        <Typography variant="h6" gutterBottom>
          Statistics Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <SettingRow>
          <Box>
            <Typography>Sessions for Averages</Typography>
            <Typography variant="caption" color="text.secondary">
              Number of previous sessions used in average calculations
            </Typography>
          </Box>
          <Box sx={{ width: 300 }}>
            <Slider
              value={settings.sessionsForAverage}
              onChange={(_, value) => updateSettings({ sessionsForAverage: value as number })}
              min={1}
              max={100}
              valueLabelDisplay="on"
              marks={[
                { value: 1, label: '1' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
                { value: 75, label: '75' },
                { value: 100, label: '100' },
              ]}
            />
          </Box>
        </SettingRow>
      </SettingSection>

      <SettingSection elevation={0}>
        <Typography variant="h6" gutterBottom>
          Score Calculation Settings
        </Typography>
        <Divider sx={{ mb: 2 }} />
        
        <SettingRow>
          <Box>
            <Typography>K0 Coefficient</Typography>
            <Typography variant="caption" color="text.secondary">
              Controls WPM impact (higher = less impact from WPM)
            </Typography>
          </Box>
          <Box sx={{ width: 300 }}>
            <Slider
              value={settings.scoreK0}
              onChange={(_, value) => updateSettings({ scoreK0: value as number })}
              min={25}
              max={125}
              step={5}
              valueLabelDisplay="on"
              marks={[
                { value: 25, label: '25' },
                { value: 75, label: '75' },
                { value: 125, label: '125' },
              ]}
            />
          </Box>
        </SettingRow>
        
        <SettingRow>
          <Box>
            <Typography>K1 Coefficient</Typography>
            <Typography variant="caption" color="text.secondary">
              Controls accuracy penalty impact (lower = stricter)
            </Typography>
          </Box>
          <Box sx={{ width: 300 }}>
            <Slider
              value={settings.scoreK1}
              onChange={(_, value) => updateSettings({ scoreK1: value as number })}
              min={0.75}
              max={0.95}
              step={0.01}
              valueLabelDisplay="on"
              marks={[
                { value: 0.75, label: '0.75' },
                { value: 0.85, label: '0.85' },
                { value: 0.95, label: '0.95' },
              ]}
            />
          </Box>
        </SettingRow>
        
        <SettingRow>
          <Box>
            <Typography>K2 Coefficient</Typography>
            <Typography variant="caption" color="text.secondary">
              Controls character count impact (lower = rewards longer texts)
            </Typography>
          </Box>
          <Box sx={{ width: 300 }}>
            <Slider
              value={settings.scoreK2}
              onChange={(_, value) => updateSettings({ scoreK2: value as number })}
              min={5}
              max={25}
              step={1}
              valueLabelDisplay="on"
              marks={[
                { value: 5, label: '5' },
                { value: 15, label: '15' },
                { value: 25, label: '25' },
              ]}
            />
          </Box>
        </SettingRow>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Score Formula: 1000 × (2^(WPM/K0)) × (K1^((1-Accuracy)×100)) × log₁₀(Characters/K2 + 1)
          </Typography>
        </Box>
      </SettingSection>

      <SettingSection elevation={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Preview</Typography>
          <Button variant="outlined" onClick={handleResetSettings}>
            Reset to Defaults
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />

        <PreviewText
          customFont={settings.fontFamily}
          customSize={settings.fontSize}
          customStyle={settings.fontStyle}
          customColor={settings.textColor}
        >
          The quick brown fox jumps over the lazy dog.
          Pack my box with five dozen liquor jugs.
          How vexingly quick daft zebras jump!
        </PreviewText>
      </SettingSection>
    </SettingsContainer>
  );
};

export default SettingsTab;