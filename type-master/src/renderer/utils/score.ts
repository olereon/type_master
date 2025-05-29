export function calculateScore(
  wpm: number,
  accuracy: number, // 0-1 range
  characters: number,
  k0: number,
  k1: number,
  k2: number
): number {
  // Score = 1000 * (2 ^ (WPM / K0)) × (K1 ^ ((1 - Accuracy) × 100)) × log10(Characters / K2 + 1)
  // Ensure all inputs are valid
  if (wpm <= 0 || characters <= 0 || k0 <= 0 || k1 <= 0 || k2 <= 0) {
    return 0;
  }
  
  const wpmTerm = Math.pow(2, wpm / k0);
  const accuracyPenalty = (1 - accuracy) * 100;
  const accuracyTerm = Math.pow(k1, accuracyPenalty);
  
  // Calculate log10(Characters/K2 + 1) which is always positive since Characters/K2 + 1 >= 1
  const characterRatio = characters / k2 + 1;
  const characterTerm = Math.log10(characterRatio);
  
  const score = 1000 * wpmTerm * accuracyTerm * characterTerm;
  
  return Math.floor(Math.max(0, score)); // Ensure non-negative integer
}

export function getScoreColor(score: number, maxScore: number): string {
  if (maxScore === 0) return '#424242';
  const normalized = Math.min(1, score / maxScore);
  
  // Create a gradient from dark blue to bright orange/red
  if (normalized < 0.2) return '#1976D2'; // Dark blue
  if (normalized < 0.4) return '#388E3C'; // Green
  if (normalized < 0.6) return '#FBC02D'; // Yellow
  if (normalized < 0.8) return '#F57C00'; // Orange
  return '#D32F2F'; // Red for high scores
}

export function isHighScore(score: number, allScores: number[]): boolean {
  if (allScores.length === 0) return false;
  const maxScore = Math.max(...allScores);
  return score === maxScore && score > 0;
}