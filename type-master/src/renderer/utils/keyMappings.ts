// Key position and finger mapping for different keyboard layouts
// This is used for visual feedback only - does not affect actual input

export interface KeyPosition {
  row: number;        // 1=number row, 2=QWERTY row, 3=ASDF row, 4=ZXCV row
  col: number;        // Column position from left (0-based)
  finger: string;     // Which finger should press this key
  hand: 'left' | 'right' | 'both';
}

export type KeyMappings = Record<string, KeyPosition>;

// US-QWERTY Layout Mapping
const usQwertyMapping: KeyMappings = {
  // Number row (row 1)
  '`': { row: 1, col: 0, finger: 'pinky', hand: 'left' },
  '1': { row: 1, col: 1, finger: 'pinky', hand: 'left' },
  '2': { row: 1, col: 2, finger: 'ring', hand: 'left' },
  '3': { row: 1, col: 3, finger: 'middle', hand: 'left' },
  '4': { row: 1, col: 4, finger: 'index', hand: 'left' },
  '5': { row: 1, col: 5, finger: 'index', hand: 'left' },
  '6': { row: 1, col: 6, finger: 'index', hand: 'right' },
  '7': { row: 1, col: 7, finger: 'index', hand: 'right' },
  '8': { row: 1, col: 8, finger: 'middle', hand: 'right' },
  '9': { row: 1, col: 9, finger: 'ring', hand: 'right' },
  '0': { row: 1, col: 10, finger: 'pinky', hand: 'right' },
  '-': { row: 1, col: 11, finger: 'pinky', hand: 'right' },
  '=': { row: 1, col: 12, finger: 'pinky', hand: 'right' },

  // QWERTY row (row 2)
  'q': { row: 2, col: 0, finger: 'pinky', hand: 'left' },
  'w': { row: 2, col: 1, finger: 'ring', hand: 'left' },
  'e': { row: 2, col: 2, finger: 'middle', hand: 'left' },
  'r': { row: 2, col: 3, finger: 'index', hand: 'left' },
  't': { row: 2, col: 4, finger: 'index', hand: 'left' },
  'y': { row: 2, col: 5, finger: 'index', hand: 'right' },
  'u': { row: 2, col: 6, finger: 'index', hand: 'right' },
  'i': { row: 2, col: 7, finger: 'middle', hand: 'right' },
  'o': { row: 2, col: 8, finger: 'ring', hand: 'right' },
  'p': { row: 2, col: 9, finger: 'pinky', hand: 'right' },
  '[': { row: 2, col: 10, finger: 'pinky', hand: 'right' },
  ']': { row: 2, col: 11, finger: 'pinky', hand: 'right' },
  '\\': { row: 2, col: 12, finger: 'pinky', hand: 'right' },

  // ASDF row (row 3) - Home row
  'a': { row: 3, col: 0, finger: 'pinky', hand: 'left' },
  's': { row: 3, col: 1, finger: 'ring', hand: 'left' },
  'd': { row: 3, col: 2, finger: 'middle', hand: 'left' },
  'f': { row: 3, col: 3, finger: 'index', hand: 'left' },
  'g': { row: 3, col: 4, finger: 'index', hand: 'left' },
  'h': { row: 3, col: 5, finger: 'index', hand: 'right' },
  'j': { row: 3, col: 6, finger: 'index', hand: 'right' },
  'k': { row: 3, col: 7, finger: 'middle', hand: 'right' },
  'l': { row: 3, col: 8, finger: 'ring', hand: 'right' },
  ';': { row: 3, col: 9, finger: 'pinky', hand: 'right' },
  "'": { row: 3, col: 10, finger: 'pinky', hand: 'right' },

  // ZXCV row (row 4)
  'z': { row: 4, col: 0, finger: 'pinky', hand: 'left' },
  'x': { row: 4, col: 1, finger: 'ring', hand: 'left' },
  'c': { row: 4, col: 2, finger: 'middle', hand: 'left' },
  'v': { row: 4, col: 3, finger: 'index', hand: 'left' },
  'b': { row: 4, col: 4, finger: 'index', hand: 'left' },
  'n': { row: 4, col: 5, finger: 'index', hand: 'right' },
  'm': { row: 4, col: 6, finger: 'index', hand: 'right' },
  ',': { row: 4, col: 7, finger: 'middle', hand: 'right' },
  '.': { row: 4, col: 8, finger: 'ring', hand: 'right' },
  '/': { row: 4, col: 9, finger: 'pinky', hand: 'right' },

  // Space bar
  ' ': { row: 5, col: 0, finger: 'thumb', hand: 'both' },
};

// DVORAK Layout Mapping
const dvorakMapping: KeyMappings = {
  // Number row (row 1) - same as QWERTY
  '`': { row: 1, col: 0, finger: 'pinky', hand: 'left' },
  '1': { row: 1, col: 1, finger: 'pinky', hand: 'left' },
  '2': { row: 1, col: 2, finger: 'ring', hand: 'left' },
  '3': { row: 1, col: 3, finger: 'middle', hand: 'left' },
  '4': { row: 1, col: 4, finger: 'index', hand: 'left' },
  '5': { row: 1, col: 5, finger: 'index', hand: 'left' },
  '6': { row: 1, col: 6, finger: 'index', hand: 'right' },
  '7': { row: 1, col: 7, finger: 'index', hand: 'right' },
  '8': { row: 1, col: 8, finger: 'middle', hand: 'right' },
  '9': { row: 1, col: 9, finger: 'ring', hand: 'right' },
  '0': { row: 1, col: 10, finger: 'pinky', hand: 'right' },
  '[': { row: 1, col: 11, finger: 'pinky', hand: 'right' },
  ']': { row: 1, col: 12, finger: 'pinky', hand: 'right' },

  // Top row (row 2) - DVORAK: ',.pyfgcrl/=
  "'": { row: 2, col: 0, finger: 'pinky', hand: 'left' },
  ',': { row: 2, col: 1, finger: 'ring', hand: 'left' },
  '.': { row: 2, col: 2, finger: 'middle', hand: 'left' },
  'p': { row: 2, col: 3, finger: 'index', hand: 'left' },
  'y': { row: 2, col: 4, finger: 'index', hand: 'left' },
  'f': { row: 2, col: 5, finger: 'index', hand: 'right' },
  'g': { row: 2, col: 6, finger: 'index', hand: 'right' },
  'c': { row: 2, col: 7, finger: 'middle', hand: 'right' },
  'r': { row: 2, col: 8, finger: 'ring', hand: 'right' },
  'l': { row: 2, col: 9, finger: 'pinky', hand: 'right' },
  '/': { row: 2, col: 10, finger: 'pinky', hand: 'right' },
  '=': { row: 2, col: 11, finger: 'pinky', hand: 'right' },
  '\\': { row: 2, col: 12, finger: 'pinky', hand: 'right' },

  // Home row (row 3) - DVORAK: aoeuidhtns-
  'a': { row: 3, col: 0, finger: 'pinky', hand: 'left' },
  'o': { row: 3, col: 1, finger: 'ring', hand: 'left' },
  'e': { row: 3, col: 2, finger: 'middle', hand: 'left' },
  'u': { row: 3, col: 3, finger: 'index', hand: 'left' },
  'i': { row: 3, col: 4, finger: 'index', hand: 'left' },
  'd': { row: 3, col: 5, finger: 'index', hand: 'right' },
  'h': { row: 3, col: 6, finger: 'index', hand: 'right' },
  't': { row: 3, col: 7, finger: 'middle', hand: 'right' },
  'n': { row: 3, col: 8, finger: 'ring', hand: 'right' },
  's': { row: 3, col: 9, finger: 'pinky', hand: 'right' },
  '-': { row: 3, col: 10, finger: 'pinky', hand: 'right' },

  // Bottom row (row 4) - DVORAK: ;qjkxbmwvz
  ';': { row: 4, col: 0, finger: 'pinky', hand: 'left' },
  'q': { row: 4, col: 1, finger: 'ring', hand: 'left' },
  'j': { row: 4, col: 2, finger: 'middle', hand: 'left' },
  'k': { row: 4, col: 3, finger: 'index', hand: 'left' },
  'x': { row: 4, col: 4, finger: 'index', hand: 'left' },
  'b': { row: 4, col: 5, finger: 'index', hand: 'right' },
  'm': { row: 4, col: 6, finger: 'index', hand: 'right' },
  'w': { row: 4, col: 7, finger: 'middle', hand: 'right' },
  'v': { row: 4, col: 8, finger: 'ring', hand: 'right' },
  'z': { row: 4, col: 9, finger: 'pinky', hand: 'right' },

  // Space bar
  ' ': { row: 5, col: 0, finger: 'thumb', hand: 'both' },
};

// Colemak Layout Mapping
const colemakMapping: KeyMappings = {
  // Number row (row 1) - same as QWERTY
  '`': { row: 1, col: 0, finger: 'pinky', hand: 'left' },
  '1': { row: 1, col: 1, finger: 'pinky', hand: 'left' },
  '2': { row: 1, col: 2, finger: 'ring', hand: 'left' },
  '3': { row: 1, col: 3, finger: 'middle', hand: 'left' },
  '4': { row: 1, col: 4, finger: 'index', hand: 'left' },
  '5': { row: 1, col: 5, finger: 'index', hand: 'left' },
  '6': { row: 1, col: 6, finger: 'index', hand: 'right' },
  '7': { row: 1, col: 7, finger: 'index', hand: 'right' },
  '8': { row: 1, col: 8, finger: 'middle', hand: 'right' },
  '9': { row: 1, col: 9, finger: 'ring', hand: 'right' },
  '0': { row: 1, col: 10, finger: 'pinky', hand: 'right' },
  '-': { row: 1, col: 11, finger: 'pinky', hand: 'right' },
  '=': { row: 1, col: 12, finger: 'pinky', hand: 'right' },

  // Top row (row 2) - Colemak: qwfpgjluy;[]
  'q': { row: 2, col: 0, finger: 'pinky', hand: 'left' },
  'w': { row: 2, col: 1, finger: 'ring', hand: 'left' },
  'f': { row: 2, col: 2, finger: 'middle', hand: 'left' },
  'p': { row: 2, col: 3, finger: 'index', hand: 'left' },
  'g': { row: 2, col: 4, finger: 'index', hand: 'left' },
  'j': { row: 2, col: 5, finger: 'index', hand: 'right' },
  'l': { row: 2, col: 6, finger: 'index', hand: 'right' },
  'u': { row: 2, col: 7, finger: 'middle', hand: 'right' },
  'y': { row: 2, col: 8, finger: 'ring', hand: 'right' },
  ';': { row: 2, col: 9, finger: 'pinky', hand: 'right' },
  '[': { row: 2, col: 10, finger: 'pinky', hand: 'right' },
  ']': { row: 2, col: 11, finger: 'pinky', hand: 'right' },
  '\\': { row: 2, col: 12, finger: 'pinky', hand: 'right' },

  // Home row (row 3) - Colemak: arstdhneio'
  'a': { row: 3, col: 0, finger: 'pinky', hand: 'left' },
  'r': { row: 3, col: 1, finger: 'ring', hand: 'left' },
  's': { row: 3, col: 2, finger: 'middle', hand: 'left' },
  't': { row: 3, col: 3, finger: 'index', hand: 'left' },
  'd': { row: 3, col: 4, finger: 'index', hand: 'left' },
  'h': { row: 3, col: 5, finger: 'index', hand: 'right' },
  'n': { row: 3, col: 6, finger: 'index', hand: 'right' },
  'e': { row: 3, col: 7, finger: 'middle', hand: 'right' },
  'i': { row: 3, col: 8, finger: 'ring', hand: 'right' },
  'o': { row: 3, col: 9, finger: 'pinky', hand: 'right' },
  "'": { row: 3, col: 10, finger: 'pinky', hand: 'right' },

  // Bottom row (row 4) - Colemak: zxcvbkm,./
  'z': { row: 4, col: 0, finger: 'pinky', hand: 'left' },
  'x': { row: 4, col: 1, finger: 'ring', hand: 'left' },
  'c': { row: 4, col: 2, finger: 'middle', hand: 'left' },
  'v': { row: 4, col: 3, finger: 'index', hand: 'left' },
  'b': { row: 4, col: 4, finger: 'index', hand: 'left' },
  'k': { row: 4, col: 5, finger: 'index', hand: 'right' },
  'm': { row: 4, col: 6, finger: 'index', hand: 'right' },
  ',': { row: 4, col: 7, finger: 'middle', hand: 'right' },
  '.': { row: 4, col: 8, finger: 'ring', hand: 'right' },
  '/': { row: 4, col: 9, finger: 'pinky', hand: 'right' },

  // Space bar
  ' ': { row: 5, col: 0, finger: 'thumb', hand: 'both' },
};

// WORKMAN Layout Mapping
const workmanMapping: KeyMappings = {
  // Number row (row 1) - same as QWERTY
  '`': { row: 1, col: 0, finger: 'pinky', hand: 'left' },
  '1': { row: 1, col: 1, finger: 'pinky', hand: 'left' },
  '2': { row: 1, col: 2, finger: 'ring', hand: 'left' },
  '3': { row: 1, col: 3, finger: 'middle', hand: 'left' },
  '4': { row: 1, col: 4, finger: 'index', hand: 'left' },
  '5': { row: 1, col: 5, finger: 'index', hand: 'left' },
  '6': { row: 1, col: 6, finger: 'index', hand: 'right' },
  '7': { row: 1, col: 7, finger: 'index', hand: 'right' },
  '8': { row: 1, col: 8, finger: 'middle', hand: 'right' },
  '9': { row: 1, col: 9, finger: 'ring', hand: 'right' },
  '0': { row: 1, col: 10, finger: 'pinky', hand: 'right' },
  '-': { row: 1, col: 11, finger: 'pinky', hand: 'right' },
  '=': { row: 1, col: 12, finger: 'pinky', hand: 'right' },

  // Top row (row 2) - Workman: qdrwbjfup;[]
  'q': { row: 2, col: 0, finger: 'pinky', hand: 'left' },
  'd': { row: 2, col: 1, finger: 'ring', hand: 'left' },
  'r': { row: 2, col: 2, finger: 'middle', hand: 'left' },
  'w': { row: 2, col: 3, finger: 'index', hand: 'left' },
  'b': { row: 2, col: 4, finger: 'index', hand: 'left' },
  'j': { row: 2, col: 5, finger: 'index', hand: 'right' },
  'f': { row: 2, col: 6, finger: 'index', hand: 'right' },
  'u': { row: 2, col: 7, finger: 'middle', hand: 'right' },
  'p': { row: 2, col: 8, finger: 'ring', hand: 'right' },
  ';': { row: 2, col: 9, finger: 'pinky', hand: 'right' },
  '[': { row: 2, col: 10, finger: 'pinky', hand: 'right' },
  ']': { row: 2, col: 11, finger: 'pinky', hand: 'right' },
  '\\': { row: 2, col: 12, finger: 'pinky', hand: 'right' },

  // Home row (row 3) - Workman: ashtgyneoi'
  'a': { row: 3, col: 0, finger: 'pinky', hand: 'left' },
  's': { row: 3, col: 1, finger: 'ring', hand: 'left' },
  'h': { row: 3, col: 2, finger: 'middle', hand: 'left' },
  't': { row: 3, col: 3, finger: 'index', hand: 'left' },
  'g': { row: 3, col: 4, finger: 'index', hand: 'left' },
  'y': { row: 3, col: 5, finger: 'index', hand: 'right' },
  'n': { row: 3, col: 6, finger: 'index', hand: 'right' },
  'e': { row: 3, col: 7, finger: 'middle', hand: 'right' },
  'o': { row: 3, col: 8, finger: 'ring', hand: 'right' },
  'i': { row: 3, col: 9, finger: 'pinky', hand: 'right' },
  "'": { row: 3, col: 10, finger: 'pinky', hand: 'right' },

  // Bottom row (row 4) - Workman: zxmcvkl,./
  'z': { row: 4, col: 0, finger: 'pinky', hand: 'left' },
  'x': { row: 4, col: 1, finger: 'ring', hand: 'left' },
  'm': { row: 4, col: 2, finger: 'middle', hand: 'left' },
  'c': { row: 4, col: 3, finger: 'index', hand: 'left' },
  'v': { row: 4, col: 4, finger: 'index', hand: 'left' },
  'k': { row: 4, col: 5, finger: 'index', hand: 'right' },
  'l': { row: 4, col: 6, finger: 'index', hand: 'right' },
  ',': { row: 4, col: 7, finger: 'middle', hand: 'right' },
  '.': { row: 4, col: 8, finger: 'ring', hand: 'right' },
  '/': { row: 4, col: 9, finger: 'pinky', hand: 'right' },

  // Space bar
  ' ': { row: 5, col: 0, finger: 'thumb', hand: 'both' },
};
// LATAM Layout Mapping
const eslatamMapping: KeyMappings = {
  // Number row (row 1) - same as QWERTY
  '`': { row: 1, col: 0, finger: 'pinky', hand: 'left' },
  '1': { row: 1, col: 1, finger: 'pinky', hand: 'left' },
  '2': { row: 1, col: 2, finger: 'ring', hand: 'left' },
  '3': { row: 1, col: 3, finger: 'middle', hand: 'left' },
  '4': { row: 1, col: 4, finger: 'index', hand: 'left' },
  '5': { row: 1, col: 5, finger: 'index', hand: 'left' },
  '6': { row: 1, col: 6, finger: 'index', hand: 'right' },
  '7': { row: 1, col: 7, finger: 'index', hand: 'right' },
  '8': { row: 1, col: 8, finger: 'middle', hand: 'right' },
  '9': { row: 1, col: 9, finger: 'ring', hand: 'right' },
  '0': { row: 1, col: 10, finger: 'pinky', hand: 'right' },
  "'": { row: 1, col: 11, finger: 'pinky', hand: 'right' },
  '¿': { row: 1, col: 12, finger: 'pinky', hand: 'right' },

  // Top row (row 2) - LATAM: qdrwbjfup;[]
  'q': { row: 2, col: 0, finger: 'pinky', hand: 'left' },
  'w': { row: 2, col: 1, finger: 'ring', hand: 'left' },
  'e': { row: 2, col: 2, finger: 'middle', hand: 'left' },
  'r': { row: 2, col: 3, finger: 'index', hand: 'left' },
  't': { row: 2, col: 4, finger: 'index', hand: 'left' },
  'y': { row: 2, col: 5, finger: 'index', hand: 'right' },
  'u': { row: 2, col: 6, finger: 'index', hand: 'right' },
  'i': { row: 2, col: 7, finger: 'middle', hand: 'right' },
  'o': { row: 2, col: 8, finger: 'ring', hand: 'right' },
  'p': { row: 2, col: 9, finger: 'pinky', hand: 'right' },
  "´": { row: 2, col: 10, finger: 'pinky', hand: 'right' },
  '+': { row: 2, col: 11, finger: 'pinky', hand: 'right' },
  '\\': { row: 2, col: 12, finger: 'pinky', hand: 'right' },

  // Home row (row 3) - LATAM: ashtgyneoi'
  'a': { row: 3, col: 0, finger: 'pinky', hand: 'left' },
  's': { row: 3, col: 1, finger: 'ring', hand: 'left' },
  'd': { row: 3, col: 2, finger: 'middle', hand: 'left' },
  'f': { row: 3, col: 3, finger: 'index', hand: 'left' },
  'g': { row: 3, col: 4, finger: 'index', hand: 'left' },
  'h': { row: 3, col: 5, finger: 'index', hand: 'right' },
  'j': { row: 3, col: 6, finger: 'index', hand: 'right' },
  'k': { row: 3, col: 7, finger: 'middle', hand: 'right' },
  'l': { row: 3, col: 8, finger: 'ring', hand: 'right' },
  'ñ': { row: 3, col: 9, finger: 'pinky', hand: 'right' },
  "{": { row: 3, col: 10, finger: 'pinky', hand: 'right' },
  "}": { row: 3, col: 11, finger: 'pinky', hand: 'right' },

  // Bottom row (row 4) - LATAM: zxmcvkl,./
  'z': { row: 4, col: 0, finger: 'pinky', hand: 'left' },
  'x': { row: 4, col: 1, finger: 'ring', hand: 'left' },
  'c': { row: 4, col: 2, finger: 'middle', hand: 'left' },
  'v': { row: 4, col: 3, finger: 'index', hand: 'left' },
  'b': { row: 4, col: 4, finger: 'index', hand: 'left' },
  'n': { row: 4, col: 5, finger: 'index', hand: 'right' },
  'm': { row: 4, col: 6, finger: 'index', hand: 'right' },
  ',': { row: 4, col: 7, finger: 'middle', hand: 'right' },
  '.': { row: 4, col: 8, finger: 'ring', hand: 'right' },
  '-': { row: 4, col: 9, finger: 'pinky', hand: 'right' },

  // Space bar
  ' ': { row: 5, col: 0, finger: 'thumb', hand: 'both' },
};
// Main keyboard layout mappings
export const keyboardMappings: Record<string, KeyMappings> = {
  'US-QWERTY': usQwertyMapping,
  'UK-QWERTY': usQwertyMapping, // Same as US for basic letters
  'DVORAK': dvorakMapping,
  'COLEMAK': colemakMapping,
  'WORKMAN': workmanMapping, // TODO: Add proper Workman mapping
  'LATAM': eslatamMapping, // Added Spanish LATAM key mapping
  'Standart': usQwertyMapping, // Fallback to US-QWERTY
};

// Utility functions
export const getKeyPosition = (char: string, layout: string): KeyPosition | null => {
  const mapping = keyboardMappings[layout] || keyboardMappings['US-QWERTY'];
  return mapping[char.toLowerCase()] || null;
};

export const getKeyRow = (char: string, layout: string): number | null => {
  const position = getKeyPosition(char, layout);
  return position ? position.row : null;
};

export const getKeyFinger = (char: string, layout: string): string | null => {
  const position = getKeyPosition(char, layout);
  return position ? position.finger : null;
};

export const getKeyHand = (char: string, layout: string): 'left' | 'right' | 'both' | null => {
  const position = getKeyPosition(char, layout);
  return position ? position.hand : null;
};

// Row color scheme for keyboard row coloring feature
export const rowColors = {
  1: '#FFEAA7', // Number row - Yellow
  2: '#4ECDC4', // QWERTY row - Teal
  3: '#45B7D1', // ASDF row (home) - Blue
  4: '#96CEB4', // ZXCV row - Green
  5: '#808080', // Space bar - Grey
} as const;

export const getRowColor = (row: number): string => {
  return rowColors[row as keyof typeof rowColors] || '#CCCCCC';
};