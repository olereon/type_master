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
  ToggleButton,
  ToggleButtonGroup,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { HexColorPicker } from 'react-colorful';
import { useAppStore } from '../store/useAppStore';

const SettingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  height: '100%',
  overflow: 'hidden',
}));

const ColumnsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  height: '100%',
}));

const SettingsColumn = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  overflow: 'auto',
}));

const SettingSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  flex: '0 0 auto',
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

const WhitespaceSymbolButton = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(1),
  minWidth: 40,
  fontSize: '1.5rem',
  fontFamily: 'monospace',
}));

const WhitespacePreview = styled(Box)(({ theme }) => ({
  fontSize: '3rem',
  fontFamily: 'monospace',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 80,
  marginTop: theme.spacing(1),
}));

const CursorButton = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(1.5),
  minWidth: 60,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

const CursorDemo = styled(Box)(({ theme }) => ({
  width: 20,
  height: 20,
  position: 'relative',
  backgroundColor: theme.palette.action.hover,
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '12px',
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

  const whitespaceSymbols = [
    { symbol: '\u2022', name: 'Bullet' }, // •
    { symbol: '\u00B7', name: 'Middle Dot' }, // ·
    { symbol: '\u2218', name: 'Ring Operator' }, // ∘
    { symbol: '\u2219', name: 'Bullet Operator' }, // ∙
    { symbol: '\u25E6', name: 'White Bullet' }, // ◦
    { symbol: '\u2023', name: 'Triangular Bullet' }, // ‣
    { symbol: '\u25AA', name: 'Square Bullet' }, // ▪
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
      whitespaceSymbol: '\u00B7',
      showWhitespaceSymbols: false,
      cursorType: 'block',
    });
  };

  return (
    <SettingsContainer>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Settings
      </Typography>

      <ColumnsContainer>
        {/* Font & Text Column */}
        <SettingsColumn>
          <SettingSection elevation={1}>
            <Typography variant="h6" gutterBottom>
              Font & Text
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <SettingRow>
              <Typography>Font Size</Typography>
              <Box sx={{ width: 200 }}>
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
              <FormControl sx={{ width: 200 }}>
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
              <FormControl sx={{ width: 200 }}>
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

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Text Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HexColorPicker
                  color={settings.textColor}
                  onChange={(color) => updateSettings({ textColor: color })}
                  style={{ width: 120, height: 120 }}
                />
                <Typography variant="caption">
                  {settings.textColor}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Whitespace Symbol
              </Typography>
              <ToggleButtonGroup
                value={settings.whitespaceSymbol}
                exclusive
                onChange={(_, value) => value && updateSettings({ whitespaceSymbol: value })}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
              >
                {whitespaceSymbols.map(({ symbol, name }) => (
                  <WhitespaceSymbolButton
                    key={symbol}
                    value={symbol}
                    title={name}
                  >
                    {symbol}
                  </WhitespaceSymbolButton>
                ))}
              </ToggleButtonGroup>
              
              <WhitespacePreview>
                <span style={{ opacity: 0.5 }}>Text</span>
                <span style={{ color: settings.showWhitespaceSymbols ? settings.textColor : 'transparent' }}>
                  {settings.whitespaceSymbol}
                </span>
                <span style={{ opacity: 0.5 }}>with</span>
                <span style={{ color: settings.showWhitespaceSymbols ? settings.textColor : 'transparent' }}>
                  {settings.whitespaceSymbol}
                </span>
                <span style={{ opacity: 0.5 }}>spaces</span>
              </WhitespacePreview>
            </Box>

            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.showWhitespaceSymbols}
                    onChange={(e) => updateSettings({ showWhitespaceSymbols: e.target.checked })}
                  />
                }
                label="Show whitespace symbols as text color"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ ml: 7 }}>
                When disabled, whitespace symbols match the background color until mistyped
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Cursor Type
              </Typography>
              <ToggleButtonGroup
                value={settings.cursorType}
                exclusive
                onChange={(_, value) => value && updateSettings({ cursorType: value })}
                sx={{ display: 'flex', gap: 0.5 }}
              >
                <CursorButton value="block" title="Block Cursor">
                  <CursorDemo>
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%', 
                      backgroundColor: 'primary.main',
                      borderRadius: 1
                    }} />
                  </CursorDemo>
                  <Typography variant="caption">Block</Typography>
                </CursorButton>
                
                <CursorButton value="box" title="Box Cursor">
                  <CursorDemo>
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%', 
                      border: '2px solid',
                      borderColor: 'primary.main',
                      borderRadius: 1,
                      boxSizing: 'border-box'
                    }} />
                  </CursorDemo>
                  <Typography variant="caption">Box</Typography>
                </CursorButton>
                
                <CursorButton value="line" title="Vertical Line Cursor">
                  <CursorDemo>
                    <Box sx={{ 
                      width: '2px', 
                      height: '100%', 
                      backgroundColor: 'primary.main'
                    }} />
                  </CursorDemo>
                  <Typography variant="caption">Line</Typography>
                </CursorButton>
                
                <CursorButton value="underline" title="Underline Cursor">
                  <CursorDemo>
                    <Box sx={{ 
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%', 
                      height: '2px', 
                      backgroundColor: 'primary.main'
                    }} />
                  </CursorDemo>
                  <Typography variant="caption">Under</Typography>
                </CursorButton>
              </ToggleButtonGroup>
            </Box>
          </SettingSection>
        </SettingsColumn>

        {/* Visual & Sound Column */}
        <SettingsColumn>
          <SettingSection elevation={1}>
            <Typography variant="h6" gutterBottom>
              Visual & Sound
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Primary Color
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <HexColorPicker
                  color={settings.primaryColor}
                  onChange={(color) => updateSettings({ primaryColor: color })}
                  style={{ width: 120, height: 120 }}
                />
                <Typography variant="caption">
                  {settings.primaryColor}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Preview
              </Typography>
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
            </Box>

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <Button variant="outlined" onClick={handleResetSettings}>
                Reset to Defaults
              </Button>
            </Box>
          </SettingSection>
        </SettingsColumn>

        {/* Sliders Column */}
        <SettingsColumn>
          <SettingSection elevation={1}>
            <Typography variant="h6" gutterBottom>
              Sliders
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <SettingRow>
              <Box>
                <Typography>Sessions for Averages</Typography>
                <Typography variant="caption" color="text.secondary">
                  Number of previous sessions used in average calculations
                </Typography>
              </Box>
              <Box sx={{ width: 200 }}>
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
            
            <SettingRow>
              <Box>
                <Typography>K0 Coefficient</Typography>
                <Typography variant="caption" color="text.secondary">
                  Controls WPM impact (higher = less impact from WPM)
                </Typography>
              </Box>
              <Box sx={{ width: 200 }}>
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
              <Box sx={{ width: 200 }}>
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
              <Box sx={{ width: 200 }}>
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
        </SettingsColumn>
      </ColumnsContainer>
    </SettingsContainer>
  );
};

export default SettingsTab;