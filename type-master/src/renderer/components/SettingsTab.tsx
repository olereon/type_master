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
import { Language, Keyboard } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { HexColorPicker } from 'react-colorful';
import { useAppStore } from '../store/useAppStore';
import { getLayoutImageSrc } from '../utils/keyboardLayouts';

const SettingsContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingTop: 0, // Remove top padding to lift content
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
    fontFamily: `${customFont} !important`,
    fontSize: `${customSize}px !important`,
    fontStyle: `${customStyle === 'italic' ? 'italic' : 'normal'} !important`,
    fontWeight: `${customStyle === 'bold' ? 600 : 400} !important`,
    color: `${customColor} !important`,
    margin: 0,
    padding: 0,
    lineHeight: '1.2 !important',
    '&.MuiTypography-root': {
      fontSize: `${customSize}px !important`,
      margin: 0,
      padding: 0,
    }
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

  const keyboardLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ua', name: 'Українська' },
  ];

  const keyboardLayouts: Record<string, string[]> = {
    en: ['US-QWERTY', 'UK-QWERTY', 'DVORAK', 'COLEMAK', 'WORKMAN'],
    es: ['LATAM', 'Standart'],
    fr: ['BEPO', 'Canadian', 'Standart'],
    de: ['Standart'],
    ua: ['Standart'],
  };

  // Fix legacy layout settings
  const normalizedLayout = settings.keyboardLayout === 'QWERTY' ? 'US-QWERTY' : settings.keyboardLayout;
  
  const [selectedLanguage, setSelectedLanguage] = React.useState(settings.keyboardLanguage || 'en');
  const [selectedLayout, setSelectedLayout] = React.useState(normalizedLayout || 'US-QWERTY');
  
  const layoutImageSrc = getLayoutImageSrc(selectedLanguage, selectedLayout);

  const handleResetSettings = () => {
    updateSettings({
      fontSize: 36,
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
      keyboardLayout: 'US-QWERTY',
      keyboardLanguage: 'en',
      enableKeyboardRowColors: false,
    });
    setSelectedLanguage('en');
    setSelectedLayout('US-QWERTY');
  };

  return (
    <SettingsContainer>
      <ColumnsContainer>
        {/* Font & Text Column */}
        <SettingsColumn>
          <SettingSection elevation={1}>
            <Typography variant="h6" gutterBottom>
              Font & Text
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <SettingRow>
              <Typography>Font Size: {settings.fontSize}px</Typography>
              <Box sx={{ width: 200 }}>
                <Slider
                  value={settings.fontSize}
                  onChange={(_, value) => updateSettings({ fontSize: value as number })}
                  min={12}
                  max={48}
                  valueLabelDisplay="off"
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
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box>
                  <HexColorPicker
                    color={settings.textColor}
                    onChange={(color) => updateSettings({ textColor: color })}
                    style={{ width: 120, height: 120 }}
                  />
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    {settings.textColor}
                  </Typography>
                </Box>
                <Box sx={{ 
                  flex: 1,
                  minHeight: 128, // Height to accommodate 2 lines at 48px
                  maxHeight: 128,
                  overflow: 'hidden',
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 1,
                  ml: 1,
                  backgroundColor: 'background.default',
                  display: 'flex',
                  alignItems: 'flex-start'
                }}>
                  <PreviewText
                    customFont={settings.fontFamily}
                    customSize={settings.fontSize} // Use actual font size
                    customStyle={settings.fontStyle}
                    customColor={settings.textColor}
                  >
                    The quick brown fox jumps over the lazy dog
                  </PreviewText>
                </Box>
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

            <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
              <Box sx={{ flex: 1 }}>
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

              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Keyboard
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <FormControl sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Language fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Language
                      </Typography>
                    </Box>
                    <Select
                      value={selectedLanguage}
                      onChange={(e) => {
                        const newLang = e.target.value;
                        setSelectedLanguage(newLang);
                        const availableLayouts = keyboardLayouts[newLang] || ['QWERTY'];
                        const newLayout = availableLayouts.includes(selectedLayout) 
                          ? selectedLayout 
                          : availableLayouts[0];
                        setSelectedLayout(newLayout);
                        updateSettings({ keyboardLanguage: newLang, keyboardLayout: newLayout });
                      }}
                      size="small"
                    >
                      {keyboardLanguages.map(lang => (
                        <MenuItem key={lang.code} value={lang.code}>{lang.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <FormControl sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Keyboard fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        Layout
                      </Typography>
                    </Box>
                    <Select
                      value={selectedLayout}
                      onChange={(e) => {
                        const newLayout = e.target.value;
                        setSelectedLayout(newLayout);
                        updateSettings({ keyboardLayout: newLayout });
                      }}
                      onDoubleClick={() => {
                        // TODO: Open keyboard layout diagram
                        console.log('Double-click to show layout diagram for:', selectedLayout);
                      }}
                      size="small"
                    >
                      {(keyboardLayouts[selectedLanguage] || ['QWERTY']).map(layout => (
                        <MenuItem key={layout} value={layout}>{layout}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mt: 1 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Layout Preview
              </Typography>
              <Box sx={{
                p: 1,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: '#FFFFFF',
                textAlign: 'center',
                minHeight: 240,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {selectedLayout && selectedLanguage ? (
                  layoutImageSrc ? (
                    <img 
                      src={layoutImageSrc}
                      alt={`${selectedLayout} keyboard layout`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {selectedLayout} ({keyboardLanguages.find(l => l.code === selectedLanguage)?.name})
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        Layout image not available
                      </Typography>
                    </Box>
                  )
                ) : (
                  <Typography variant="caption" color="text.secondary">
                    Select a layout to preview
                  </Typography>
                )}
              </Box>
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

            <Box>
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
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Keyboard Row Colors (Experimental)
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enableKeyboardRowColors}
                    onChange={(e) => updateSettings({ enableKeyboardRowColors: e.target.checked })}
                  />
                }
                label="Enable keyboard row-based character coloring"
              />
              <Typography variant="caption" display="block" color="text.secondary" sx={{ ml: 7, mt: 0.5 }}>
                Colors characters based on their keyboard row position to help learn typing patterns
              </Typography>
              
              {settings.enableKeyboardRowColors && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary" gutterBottom>
                    Row Color Preview:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#FFEAA7', borderRadius: 0.5 }} />
                      <Typography variant="caption">Row 1: Numbers</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#4ECDC4', borderRadius: 0.5 }} />
                      <Typography variant="caption">Row 2: QWERTY</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#45B7D1', borderRadius: 0.5 }} />
                      <Typography variant="caption">Row 3: ASDF</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#96CEB4', borderRadius: 0.5 }} />
                      <Typography variant="caption">Row 4: ZXCV</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 16, height: 16, bgcolor: '#808080', borderRadius: 0.5 }} />
                      <Typography variant="caption">Row 5: Space</Typography>
                    </Box>
                  </Box>
                </Box>
              )}
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
                <Typography>Sessions for Averages: {settings.sessionsForAverage}</Typography>
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
                  valueLabelDisplay="off"
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
                <Typography>K0 Coefficient: {settings.scoreK0}</Typography>
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
                  valueLabelDisplay="off"
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
                <Typography>K1 Coefficient: {settings.scoreK1}</Typography>
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
                  valueLabelDisplay="off"
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
                <Typography>K2 Coefficient: {settings.scoreK2}</Typography>
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
                  valueLabelDisplay="off"
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

            <Box sx={{ mt: 'auto', pt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={handleResetSettings}>
                Reset to Defaults
              </Button>
            </Box>
          </SettingSection>
        </SettingsColumn>
      </ColumnsContainer>
    </SettingsContainer>
  );
};

export default SettingsTab;