def clean_word(word: str) -> str:

    cleaned = word.replace("'", "").strip()
    return cleaned


def is_valid_romanian_word(word: str) -> bool:
    romanian_chars = set('abcdefghijklmnopqrstuvwxyzăîâșțABCDEFGHIJKLMNOPQRSTUVWXYZĂÎÂȘȚ')
    
    return all(char in romanian_chars for char in word)


def count_letters(word: str) -> int:
    return len(word)


def extract_word_from_line(line: str) -> str:
    parts = line.strip().split()
    if parts:
        return parts[0]
    return ""


def extract_words(input_file: str, output_file: str, word_length: int) -> None:
    words = set()
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
                
                # Check if word is valid Romanian and has exactly n letters
                if is_valid_romanian_word(cleaned_word) and count_letters(cleaned_word) == word_length:
                    words.add(cleaned_word.lower())
                    valid_words += 1
        
        # Sort words alphabetically
        sorted_words = sorted(words)
        
        # Write to output file
        with open(output_file, 'w', encoding='utf-8') as outfile:
            for word in sorted_words:
                outfile.write(word + '\n')
        
        print(f"Processing complete!")
        print(f"Total lines processed: {total_lines}")
        print(f"Valid {word_length}-letter words found: {len(sorted_words)}")
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
    min_length = 3
    max_length = 9
    input_file = "loc-baza-6.0.txt"
    print(f"Input file: {input_file}")
    
    for length in range(min_length, max_length + 1):
        output_file = f"romanian_{length}_letter_words.txt"
        print(f"Extracting {length}-letter Romanian words...")
        print(f"Output file: {output_file}")
        print()
        extract_words(input_file, output_file, length)


if __name__ == "__main__":
    main()