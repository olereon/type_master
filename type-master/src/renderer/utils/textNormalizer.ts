/**
 * Text normalizer utility for converting non-standard characters to keyboard equivalents
 */

// Character mapping for common replacements
const CHARACTER_MAP: Record<string, string> = {
  // Smart quotes to straight quotes
  '\u201C': '"',  // Left double quotation mark
  '\u201D': '"',  // Right double quotation mark
  '\u2018': "'",  // Left single quotation mark
  '\u2019': "'",  // Right single quotation mark
  
  // Other quote variations
  '\u201E': '"',  // Double low-9 quotation mark
  '\u201A': "'",  // Single low-9 quotation mark
  '\u00AB': '"',  // Left-pointing double angle quotation mark
  '\u00BB': '"',  // Right-pointing double angle quotation mark
  '\u2039': "'",  // Single left-pointing angle quotation mark
  '\u203A': "'",  // Single right-pointing angle quotation mark
  
  // Dashes to standard hyphen/dash
  '\u2013': '-',  // En dash
  '\u2014': '-',  // Em dash
  '\u2212': '-',  // Minus sign
  '\u2010': '-',  // Hyphen
  
  // Ellipsis
  '\u2026': '...', // Horizontal ellipsis
  
  // Spaces
  '\u00A0': ' ',  // Non-breaking space
  '\u2002': ' ',  // En space
  '\u2003': ' ',  // Em space
  '\u2009': ' ',  // Thin space
  '\u3000': ' ',  // Ideographic space
  
  // Other punctuation
  '\u00B7': '.',  // Middle dot (when used as punctuation, not padding)
  '\u2022': '*',  // Bullet to asterisk
  '\u00B0': 'o',  // Degree sign to 'o'
  '\u00A1': '!',  // Inverted exclamation
  '\u00BF': '?',  // Inverted question mark
};

/**
 * Normalizes text by replacing non-standard characters with keyboard equivalents
 * @param text The text to normalize
 * @returns The normalized text
 */
export function normalizeText(text: string): string {
  let normalized = text;
  
  // Replace all mapped characters
  for (const [nonStandard, standard] of Object.entries(CHARACTER_MAP)) {
    // Use global replace to catch all instances
    normalized = normalized.replace(new RegExp(nonStandard, 'g'), standard);
  }
  
  // Additional normalization for line endings
  // Convert all line endings to \n
  normalized = normalized.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Remove zero-width characters
  normalized = normalized.replace(/[\u200B\u200C\u200D\uFEFF]/g, '');
  
  return normalized;
}

/**
 * Checks if text contains non-standard characters
 * @param text The text to check
 * @returns Object with hasNonStandard flag and list of found characters
 */
export function checkForNonStandardCharacters(text: string): {
  hasNonStandard: boolean;
  characters: string[];
} {
  const nonStandardChars = new Set<string>();
  
  // Check for characters in our mapping
  for (const char of Object.keys(CHARACTER_MAP)) {
    if (text.includes(char)) {
      nonStandardChars.add(char);
    }
  }
  
  // Check for other non-ASCII characters that might need attention
  // This regex matches any character outside basic ASCII printable range
  const nonAsciiRegex = /[^\x20-\x7E\n\r\t]/g;
  const matches = text.match(nonAsciiRegex) || [];
  
  for (const match of matches) {
    // Only add if not already in our map (to avoid duplicates)
    if (!CHARACTER_MAP[match]) {
      nonStandardChars.add(match);
    }
  }
  
  return {
    hasNonStandard: nonStandardChars.size > 0,
    characters: Array.from(nonStandardChars),
  };
}

/**
 * Get a preview of how text will be normalized
 * @param text The text to preview
 * @param maxLength Maximum length of preview (default 100)
 * @returns Object with original and normalized preview
 */
export function getNormalizationPreview(text: string, maxLength: number = 100): {
  original: string;
  normalized: string;
  changesFound: boolean;
} {
  const preview = text.substring(0, maxLength);
  const normalizedPreview = normalizeText(preview);
  
  return {
    original: preview + (text.length > maxLength ? '...' : ''),
    normalized: normalizedPreview + (text.length > maxLength ? '...' : ''),
    changesFound: preview !== normalizedPreview,
  };
}