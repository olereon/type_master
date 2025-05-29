export interface TypingSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  mode: 'time' | 'characters';
  targetValue: number; // seconds or character count
  text: string;
  typedChars: number;
  correctChars: number;
  incorrectChars: number;
  wpm: number;
  accuracy: number;
  keyPresses: KeyPress[];
  score?: number;
}

export interface KeyPress {
  char: string;
  timestamp: number;
  correct: boolean;
  timeSinceLastKey?: number;
}

export interface UserSettings {
  fontSize: number;
  fontFamily: string;
  fontStyle: 'normal' | 'italic' | 'bold';
  textColor: string;
  primaryColor: string;
  scoreK0: number; // default 50, range [25, 125]
  scoreK1: number; // default 0.9, range [0.75, 0.95]
  scoreK2: number; // default 10, range [5, 25]
  sessionsForAverage: number; // default 50, range [1, 100]
}

export interface TextSource {
  id: string;
  name: string;
  content: string;
  type: 'custom' | 'generated' | 'imported';
  createdAt: Date;
}

export interface SessionMetrics {
  totalRuns: number;
  totalCharacters: number;
  totalWords: number;
  maxWPM: number;
  avgWPM: number;
}

export interface KeyStatistics {
  key: string;
  avgTime: number;
  deviationPercent: number;
  totalPresses: number;
  correctPresses: number;
}