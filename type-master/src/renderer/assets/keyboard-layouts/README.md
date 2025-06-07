# Keyboard Layout Images

This folder contains keyboard layout images for the Type Master application.

## Naming Convention

All keyboard layout images should follow this naming pattern:
```
Layout_[Language]_[Layout].png
```

### Examples:
- `Layout_English_QWERTY.png`
- `Layout_English_UK-QWERTY.png`
- `Layout_English_DVORAK.png`
- `Layout_English_COLEMAK.png`
- `Layout_English_WORKMAN.png`
- `Layout_Spanish_QWERTY.png`
- `Layout_Spanish_QWERTY-ES.png`
- `Layout_French_AZERTY.png`
- `Layout_French_BÉPO.png`
- `Layout_French_Standart.png`
- `Layout_Deutsch_QWERTZ.png`
- `Layout_Deutsch_NEO.png`
- `Layout_Ukrainian_ЙЦУКЕН.png`
- `Layout_Ukrainian_QWERTY.png`

## Image Requirements

- **Format**: PNG (preferred for transparency)
- **Background**: White or transparent
- **Size**: Images will be automatically scaled to fit within the preview area
- **Recommended dimensions**: Around 800x300 pixels
- **Max display height**: 100px (images will be scaled down if larger)

## Adding New Layouts

1. Create your keyboard layout image following the naming convention
2. Place it in this folder (`src/renderer/assets/keyboard-layouts/`)
3. If adding a new language or layout, update the arrays in `SettingsTab.tsx`:
   - `keyboardLanguages` array for new languages
   - `keyboardLayouts` object for new layouts

## Notes

- The system automatically handles special characters in filenames
- If an image is not found, a text fallback will be displayed
- Images are loaded dynamically using webpack's dynamic imports