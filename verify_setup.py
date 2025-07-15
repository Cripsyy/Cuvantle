#!/usr/bin/env python3
"""
Simple verification script to check if the React app is working
"""
import os
import subprocess
import time
import webbrowser
from pathlib import Path

def main():
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("❌ Frontend directory not found!")
        return
    
    print("🔍 Checking project structure...")
    
    # Check essential files
    essential_files = [
        "package.json",
        "index.html", 
        "src/main.tsx",
        "src/App.tsx",
        "src/components/Board.tsx",
        "src/components/Keyboard.tsx",
        "src/components/Header.tsx"
    ]
    
    missing_files = []
    for file in essential_files:
        if not (frontend_dir / file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return
    
    print("✅ All essential files present!")
    
    # Check if node_modules exists
    if not (frontend_dir / "node_modules").exists():
        print("📦 Installing dependencies...")
        os.chdir(frontend_dir)
        subprocess.run(["npm", "install"], check=True)
        os.chdir("..")
    
    print("✅ Dependencies installed!")
    
    # Check if word file exists
    word_file = frontend_dir / "public" / "romanian_5_letter_words.txt"
    if word_file.exists():
        print("✅ Romanian words file is available!")
        # Count words
        with open(word_file, 'r', encoding='utf-8') as f:
            word_count = len([line for line in f if line.strip()])
        print(f"📊 Loaded {word_count} Romanian words")
    else:
        print("⚠️  Romanian words file not found in public directory")
    
    print("\n🚀 Project setup complete!")
    print("\nTo start the development server:")
    print("1. cd frontend")
    print("2. npm run dev")
    print("3. Open http://localhost:3000 in your browser")
    
    print("\n🎮 How to play Cuvântle:")
    print("- Guess the Romanian word in 6 tries")
    print("- Use Romanian letters: ă, î, â, ș, ț")
    print("- Green = correct letter in correct position")
    print("- Yellow = correct letter in wrong position")
    print("- Gray = letter not in word")

if __name__ == "__main__":
    main()
