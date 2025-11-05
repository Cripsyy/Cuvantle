# Cuvântle

A comprehensive Romanian Wordle-style word guessing game with advanced features including progressive mode, game analysis, hints system, and detailed statistics tracking.

**[Play Cuvântle](https://cuvantle.vercel.app/)**

## Features

### Game Modes
- **Standard Mode**: Choose from 3 to 9 letter words with difficulty indicators (Easy, Medium, Hard)
- **Progressive Mode**: Start at 3 letters and advance to 9 letters - complete all levels for the ultimate challenge!

### Romanian Language Support
- Full Romanian language support with diacritics (ă, î, â, ș, ț)
- US keyboard mapping: `[` = ă, `]` = î, `\` = â, `;` = ș, `'` = ț
- Physical keyboard and on-screen keyboard input
- Word validation using comprehensive Romanian dictionary

### Game Modes & Features
- **Hard Mode**: Use revealed hints in subsequent guesses (green letters must stay, yellow letters must be included)
- **Dark Mode**: Eye-friendly dark theme toggle
- **Hint System**: Get vowel or consonant hints for difficult words (7+ letters)
- **Game State Persistence**: Resume your games even after closing the browser

### Statistics & Analysis
- **Comprehensive Stats Tracking**:
  - Games played and win percentage (separate for normal and progressive modes)
  - Current and maximum win streaks
  - Guess distribution charts
  - Performance tracking by word length
- **CuvântleBot Analysis**: Advanced post-game analysis featuring:
  - Luck vs. Skill metrics for each guess
  - Information value calculations
  - Words remaining after each guess
  - Interactive step-by-step review of your game

### User Experience
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Real-time feedback and validation
- Comprehensive help modal with game instructions

## Project Structure

```
Cuvantle/
├── extract_words.py              # Python script for word extraction from dictionary
├── loc-baza-6.0.txt             # Romanian word dictionary (LOC-BAZA-6.0)
├── README.md
├── LICENSE
└── frontend/                    # React TypeScript frontend
    ├── src/
    │   ├── components/          # React components (Board, Keyboard, Modals, etc.)
    │   ├── pages/              # Main pages (Home, Game, Analysis)
    │   ├── types/              # TypeScript type definitions
    │   └── utils/              # Game logic and utilities
    │       ├── gameLogic.ts    # Core game logic
    │       ├── analysis.ts     # Game analysis algorithms
    │       ├── progressiveMode.ts  # Progressive mode logic
    │       ├── stats.ts        # Statistics tracking
    │       ├── hintState.ts    # Hint system
    │       └── words.ts        # Word loading and validation
    ├── public/                 # Static assets and word files (3-9 letters)
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.7+ (for word extraction, optional)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The development server will start at `http://localhost:3000`

### Word File Generation (Optional)
The word files are already included in `frontend/public/`, but you can regenerate them from the dictionary:

```bash
python extract_words.py
```

This will generate separate word files for 3-9 letter Romanian words from the `loc-baza-6.0.txt` dictionary.

## How to Play

### Standard Mode
1. Select your preferred word length (3-9 letters)
2. Guess the Romanian word in 6 attempts or fewer
3. After each guess, tiles change color:
   - **🟩 Green**: Correct letter in correct position
   - **🟨 Yellow**: Correct letter in wrong position
   - **⬜ Gray**: Letter not in the word
4. Use the on-screen keyboard or your physical keyboard

### Progressive Mode
1. Start with 3-letter words
2. Win to progress to the next level (4 letters, 5 letters, etc.)
3. Complete all levels up to 9 letters to master the game!
4. If you lose, restart from 3 letters

### Hard Mode
When enabled, you must use revealed hints:
- Green letters must be used in the same position
- Yellow letters must be included somewhere in the word

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Vercel
- **Dictionary**: LOC-BAZA-6.0 (Romanian Language)

