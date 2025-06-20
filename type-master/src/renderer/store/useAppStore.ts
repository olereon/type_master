import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TypingSession, UserSettings, TextSource } from '../../types';
import { normalizeText } from '../utils/textNormalizer';

interface AppState {
  // Sessions
  sessions: TypingSession[];
  currentSession: TypingSession | null;
  sessionCounter: number; // Persistent counter for session IDs
  
  // Settings
  settings: UserSettings;
  
  // Text sources
  textSources: TextSource[];
  activeTextSourceId: string | null;
  
  // Typing state
  isTypingFieldActive: boolean;
  
  // Actions
  startSession: (session: TypingSession) => void;
  updateSession: (session: TypingSession | null) => void;
  endSession: (session: TypingSession) => void;
  clearCurrentSession: () => void;
  resetAllSessions: () => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  addTextSource: (source: TextSource) => void;
  removeTextSource: (id: string) => void;
  updateTextSource: (id: string, updates: Partial<TextSource>) => void;
  setActiveTextSource: (id: string) => void;
  setTypingFieldActive: (active: boolean) => void;
  getNextSessionId: () => string;
  normalizeAllTexts: () => void;
}

const defaultSettings: UserSettings = {
  fontSize: 36,
  fontFamily: 'JetBrains Mono',
  fontStyle: 'normal',
  textColor: '#FFFFFF',
  primaryColor: '#4FC3F7',
  scoreK0: 50,
  scoreK1: 0.9,
  scoreK2: 10,
  sessionsForAverage: 50,
  whitespaceSymbol: '\u00B7', // Middle dot as default
  showWhitespaceSymbols: false, // Hidden by default
  cursorType: 'block', // Block cursor as default
  keyboardLayout: 'US-QWERTY', // US-QWERTY layout as default
  keyboardLanguage: 'en', // English as default language
  enableKeyboardRowColors: false, // Keyboard row colors disabled by default
};

const defaultTextSource: TextSource = {
  id: 'default',
  name: 'Default Practice Text',
  content: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump! The five boxing wizards jump quickly.',
  type: 'generated',
  createdAt: new Date(),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      sessionCounter: 0,
      settings: defaultSettings,
      textSources: [defaultTextSource],
      activeTextSourceId: 'default',
      isTypingFieldActive: false,
      
      startSession: (session) => set({ currentSession: session }),
      
      updateSession: (session) => set({ currentSession: session }),
      
      endSession: (session) => set((state) => ({
        sessions: [...state.sessions, session],
        currentSession: null,
      })),
      
      clearCurrentSession: () => set({ currentSession: null }),
      
      resetAllSessions: () => set({ sessions: [], currentSession: null, sessionCounter: 0 }),
      
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),
      
      addTextSource: (source) => set((state) => ({
        textSources: [...state.textSources, source],
      })),
      
      removeTextSource: (id) => set((state) => ({
        textSources: state.textSources.filter(s => s.id !== id),
        activeTextSourceId: state.activeTextSourceId === id ? 'default' : state.activeTextSourceId,
      })),
      
      updateTextSource: (id, updates) => set((state) => ({
        textSources: state.textSources.map(source => 
          source.id === id ? { ...source, ...updates } : source
        ),
      })),
      
      setActiveTextSource: (id) => set({ activeTextSourceId: id }),
      
      setTypingFieldActive: (active) => set({ isTypingFieldActive: active }),
      
      getNextSessionId: () => {
        const currentCounter = get().sessionCounter;
        const nextCounter = currentCounter + 1;
        set({ sessionCounter: nextCounter });
        
        // Format: 00001-2025-05-28-194550
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        
        return `${nextCounter.toString().padStart(5, '0')}-${year}-${month}-${day}-${hours}${minutes}${seconds}`;
      },

      // Normalize all existing text sources
      normalizeAllTexts: () => set((state) => ({
        textSources: state.textSources.map(source => ({
          ...source,
          content: normalizeText(source.content)
        }))
      })),
    }),
    {
      name: 'type-master-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);