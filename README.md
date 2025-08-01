# Cuvântle

A Romanian Wordle-style word guessing game 

## Features

- **Multiple Word Lengths**: Choose from 3 to 9 letter words with difficulty indicators
- **Romanian Language Support**: Full Romanian language support with diacritics mapping for US keyboards
- **Statistics Tracking**: Comprehensive statistics including:
  - Games played and win percentage
  - Current and maximum win streaks
  - Guess distribution charts
  - Games played by word length tracking
- **Interactive UI**: Modern React interface with smooth animations

## Project Structure

```
Cuvantle/
├── extract_5_letter_words.py    # Python script for word extraction
├── loc-baza-6.0.txt            # Romanian word dictionary
├── README.md
├── LICENSE
└── frontend/                   # React TypeScript frontend
    ├── src/
    │   ├── components/         # React components
    │   ├── types/             # TypeScript type definitions
    │   └── utils/             # Game logic and utilities
    ├── public/                # Static assets and word files
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- Python 3.7+ (for word extraction)

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Word File Generation (Optional)
The word files are already included in `frontend/public/`, but you can regenerate them:

```bash
python extract_words.py
```

## Game Rules

1. Select your preferred word length (3-9 letters)
2. Guess the Romanian word in 6 attempts or fewer
3. Letters turn:
   - **Green**: Correct letter in correct position
   - **Yellow**: Correct letter in wrong position
   - **Gray**: Letter not in the word
4. Use the on-screen keyboard or your physical keyboard

## Development

