# Type Master

A modern desktop application for improving keyboard typing skills with comprehensive analytics and customization options.

![Type Master](./docs/screenshot.png)

## Features

### 🎯 Main Typing Interface
- **Dual Practice Modes**:
  - Timer-based sessions (5, 10, 20, 30, 60 seconds)
  - Character count-based sessions (50, 100, 200, 300, 500 characters)
- **Real-time Performance Metrics**:
  - Words Per Minute (WPM)
  - Accuracy percentage
  - Character count tracking
- **Visual Feedback**:
  - Progress bar with percentage display
  - Color-coded character feedback (grey for correct, red for incorrect)
  - Current position highlighting

### ⚙️ Customizable Settings
- **Font Options**:
  - Multiple font families (JetBrains Mono, Courier New, Consolas, etc.)
  - Adjustable font size (12-48px)
  - Font styles (Regular, Italic, Bold)
- **Color Customization**:
  - Text color picker
  - Primary theme color picker
  - Live preview of changes

### 📚 Text Source Management
- **Multiple Text Sources**:
  - Default practice texts
  - Custom text creation
  - Import from .txt files
  - Random text generation
- **Text Management**:
  - Edit existing texts
  - Delete custom texts
  - Active text selection
  - Character and word count display

### 📊 Advanced Statistics
- **Session Analysis**:
  - Scatter plot of keypress speed distribution
  - Vertical markers for incorrect keypresses
  - Interactive tooltips with detailed information
- **Key Performance Table**:
  - Average time per key (in milliseconds)
  - Deviation from mean time (percentage)
  - Color-graded visualization (green for fast, red for slow)
  - Accuracy per key
  - Total press count per key

### 📈 Session Metrics Header
- Total typing runs completed
- Total characters and words typed
- Maximum and average WPM across all sessions

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Desktop Framework**: Electron
- **UI Library**: Material-UI (MUI)
- **State Management**: Zustand
- **Charts**: Recharts
- **Build Tools**: Webpack
- **Styling**: Emotion (CSS-in-JS)

## Installation

### Prerequisites
- Node.js 16+ and npm
- Git

### Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/type-master.git
cd type-master

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Package for distribution
npm run dist
```

## Development

### Project Structure
```
type-master/
├── src/
│   ├── main/           # Electron main process
│   │   ├── index.ts    # Main entry point
│   │   └── preload.ts  # Preload script
│   ├── renderer/       # React application
│   │   ├── components/ # React components
│   │   ├── store/      # Zustand store
│   │   ├── styles/     # Global styles and theme
│   │   ├── utils/      # Utility functions
│   │   ├── App.tsx     # Main app component
│   │   └── index.tsx   # Renderer entry point
│   └── types/          # TypeScript type definitions
├── webpack.*.js        # Webpack configurations
├── tsconfig.json       # TypeScript configuration
└── package.json        # Project dependencies
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Run built application
- `npm run dist` - Package application for distribution
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Usage

### Starting a Typing Session
1. Select practice mode (SEC for timer, NUM for character count)
2. Choose target value (seconds or character count)
3. Click "Start" to begin typing
4. Type the displayed text as accurately and quickly as possible
5. Session ends automatically when target is reached

### Customizing Your Experience
1. Navigate to the Settings tab
2. Adjust font size, family, and style
3. Choose custom text and primary colors
4. Preview changes in real-time
5. Reset to defaults if needed

### Managing Text Sources
1. Go to Text Source tab
2. Add custom texts via dialog
3. Import .txt files
4. Generate random practice texts
5. Select active text with radio buttons

### Analyzing Performance
1. Complete at least one typing session
2. Navigate to Statistics tab
3. Review speed distribution chart
4. Analyze key performance table
5. Identify keys that need improvement

## Architecture

### State Management
The application uses Zustand for state management with persistence:
- Session data (current and historical)
- User settings
- Text sources
- Active configurations

### Data Flow
1. User interactions trigger state updates
2. Components subscribe to relevant state slices
3. Persistence layer saves to electron-store
4. State restored on application restart

### Performance Optimizations
- Memoized calculations for statistics
- Efficient re-renders with React hooks
- Optimized chart rendering
- Lazy loading of heavy components

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Material-UI team for the excellent component library
- Electron team for the desktop framework
- React team for the UI library
- All contributors and testers