# Cuvântle - Romanian Wordle Game

A Romanian version of the popular Wordle game, built with React and TypeScript.

## Features

- 🇷🇴 Uses authentic Romanian 5-letter words
- 🎯 Supports Romanian special characters (ă, î, â, ș, ț)
- ⌨️ Both virtual and physical keyboard support
- 🎨 Beautiful, responsive design with Tailwind CSS
- ✨ Smooth animations and transitions
- 📱 Mobile-friendly interface

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Python 3.x (for word extraction)

### Installation

1. **Extract Romanian words** (if not already done):
   ```bash
   python extract_5_letter_words.py
   ```

2. **Copy words to frontend**:
   ```bash
   python copy_words.py
   ```

3. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

### Building for Production

```bash
cd frontend
npm run build
```

## How to Play

1. **Objective**: Guess the Romanian word in 6 tries or less
2. **Input**: Type letters using your keyboard or click the virtual keyboard
3. **Submit**: Press Enter to submit your guess
4. **Feedback**: 
   - 🟩 Green: Correct letter in correct position
   - 🟨 Yellow: Correct letter in wrong position  
   - ⬜ Gray: Letter not in the word
5. **Romanian Characters**: Use ă, î, â, ș, ț as needed

## Word Source

The game uses words extracted from `loc-baza-6.0.txt`, a comprehensive Romanian dictionary. Only 5-letter words containing valid Romanian characters are included.

## Project Structure

```
Cuvantle/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Game logic and utilities
│   │   └── App.tsx          # Main app component
│   ├── public/              # Static assets
│   └── package.json         # Frontend dependencies
├── extract_5_letter_words.py # Word extraction script
├── copy_words.py            # Copy words to frontend
├── loc-baza-6.0.txt         # Romanian dictionary
└── romanian_5_letter_words.txt # Extracted 5-letter words
```

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Word Processing**: Python 3
- **Build Tool**: Vite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by the original Wordle game by Josh Wardle
- Romanian dictionary from loc-baza-6.0.txt
- Built with love for the Romanian language 🇷🇴
