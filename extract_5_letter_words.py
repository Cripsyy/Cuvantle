#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Extract 5-letter Romanian words from loc-baza-6.0.txt file.
Removes apostrophes and properly handles Romanian special characters.
"""

import re
from typing import Set, List


def clean_word(word: str) -> str:
    """
    Clean a word by removing apostrophes and whitespace.
    
    Args:
        word: The raw word from the dictionary
        
    Returns:
        Cleaned word without apostrophes
    """
    # Remove apostrophes and strip whitespace
    cleaned = word.replace("'", "").strip()
    return cleaned


def is_valid_romanian_word(word: str) -> bool:
    """
    Check if a word contains only valid Romanian characters.
    
    Args:
        word: The word to check
        
    Returns:
        True if word contains only Romanian letters
    """
    # Romanian alphabet including special characters
    romanian_chars = set('abcdefghijklmnopqrstuvwxyzăîâșțABCDEFGHIJKLMNOPQRSTUVWXYZĂÎÂȘȚ')
    
    return all(char in romanian_chars for char in word)


def count_letters(word: str) -> int:
    """
    Count the actual letters in a Romanian word.
    Treats ă, î, â, ș, ț as separate letters from a, i, s, t.
    
    Args:
        word: The word to count letters for
        
    Returns:
        Number of letters in the word
    """
    return len(word)


def extract_word_from_line(line: str) -> str:
    """
    Extract the word part from a line in the dictionary file.
    
    Args:
        line: A line from the dictionary file
        
    Returns:
        The word part of the line
    """
    # Split by whitespace and take the first part (the word)
    parts = line.strip().split()
    if parts:
        return parts[0]
    return ""


def extract_5_letter_words(input_file: str, output_file: str) -> None:
    """
    Extract all 5-letter Romanian words from the input file and save to output file.
    
    Args:
        input_file: Path to the input dictionary file
        output_file: Path to the output file for 5-letter words
    """
    five_letter_words: Set[str] = set()
    total_lines = 0
    valid_words = 0
    
    try:
        with open(input_file, 'r', encoding='utf-8') as infile:
            for line in infile:
                total_lines += 1
                
                # Extract word from line
                raw_word = extract_word_from_line(line)
                if not raw_word:
                    continue
                
                # Clean the word (remove apostrophes)
                cleaned_word = clean_word(raw_word)
                
                # Skip empty words
                if not cleaned_word:
                    continue
                
                # Check if word is valid Romanian and has exactly 5 letters
                if is_valid_romanian_word(cleaned_word) and count_letters(cleaned_word) == 5:
                    five_letter_words.add(cleaned_word.lower())
                    valid_words += 1
        
        # Sort words alphabetically
        sorted_words = sorted(five_letter_words)
        
        # Write to output file
        with open(output_file, 'w', encoding='utf-8') as outfile:
            for word in sorted_words:
                outfile.write(word + '\n')
        
        print(f"Processing complete!")
        print(f"Total lines processed: {total_lines}")
        print(f"Valid 5-letter words found: {len(sorted_words)}")
        print(f"Output saved to: {output_file}")
        
        # Show some examples
        if sorted_words:
            print(f"\nFirst 10 words:")
            for word in sorted_words[:10]:
                print(f"  {word}")
            
            if len(sorted_words) > 10:
                print(f"\nLast 10 words:")
                for word in sorted_words[-10:]:
                    print(f"  {word}")
    
    except FileNotFoundError:
        print(f"Error: Input file '{input_file}' not found.")
    except Exception as e:
        print(f"Error processing file: {e}")


def main():
    """Main function to run the word extraction."""
    input_file = "loc-baza-6.0.txt"
    output_file = "romanian_5_letter_words.txt"
    
    print("Extracting 5-letter Romanian words...")
    print(f"Input file: {input_file}")
    print(f"Output file: {output_file}")
    print()
    
    extract_5_letter_words(input_file, output_file)


if __name__ == "__main__":
    main()
