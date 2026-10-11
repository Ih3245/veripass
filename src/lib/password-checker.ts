import { CharacterFeedback, PasswordComparisonResult, PasswordStrength } from '@/types/auth';

/**
 * Compares an entered password against an expected target password in real time,
 * producing character-by-character visual feedback matching the viral UI:
 * - Green (Correct): Exact match at this index
 * - Orange/Amber (Partial): Wrong case OR character exists elsewhere in the password
 * - Red (Wrong): Incorrect character
 */
export function comparePassword(entered: string, target: string): PasswordComparisonResult {
  const characters: CharacterFeedback[] = [];
  let matchCount = 0;

  for (let i = 0; i < entered.length; i++) {
    const inputChar = entered[i];
    const targetChar = target[i];

    if (targetChar !== undefined && inputChar === targetChar) {
      // Exact match
      characters.push({
        char: inputChar,
        expectedChar: targetChar,
        status: 'correct',
        reason: 'exact',
      });
      matchCount++;
    } else if (
      targetChar !== undefined &&
      inputChar.toLowerCase() === targetChar.toLowerCase()
    ) {
      // Same letter, wrong casing (e.g. 'a' instead of 'A') -> Orange Checkmark
      characters.push({
        char: inputChar,
        expectedChar: targetChar,
        status: 'partial',
        reason: 'wrong-case',
      });
    } else if (target.includes(inputChar)) {
      // Character is present in the target password, but in a different position
      characters.push({
        char: inputChar,
        expectedChar: targetChar,
        status: 'partial',
        reason: 'wrong-position',
      });
    } else {
      // Completely wrong character -> Red Cross
      characters.push({
        char: inputChar,
        expectedChar: targetChar,
        status: 'wrong',
        reason: 'incorrect',
      });
    }
  }

  const isExactMatch = entered.length === target.length && matchCount === target.length;
  const accuracyPercentage =
    entered.length > 0 ? Math.round((matchCount / Math.max(entered.length, target.length)) * 100) : 0;

  return {
    characters,
    matchCount,
    totalEntered: entered.length,
    expectedLength: target.length,
    isExactMatch,
    accuracyPercentage,
  };
}

/**
 * Comprehensive password security evaluator
 */
export function evaluateStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      level: 'Weak',
      hasMinLength: false,
      hasUppercase: false,
      hasLowercase: false,
      hasNumber: false,
      hasSpecialChar: false,
      feedback: ['Enter at least 8 characters'],
    };
  }

  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

  let criteriaMet = 0;
  const feedback: string[] = [];

  if (hasMinLength) criteriaMet++;
  else feedback.push('Use 8 or more characters');

  if (hasUppercase) criteriaMet++;
  else feedback.push('Include at least one uppercase letter');

  if (hasLowercase) criteriaMet++;
  else feedback.push('Include at least one lowercase letter');

  if (hasNumber) criteriaMet++;
  else feedback.push('Include at least one number');

  if (hasSpecialChar) criteriaMet++;
  else feedback.push('Include at least one symbol (!@#$%^&*)');

  // Bonus for length
  let lengthBonus = 0;
  if (password.length >= 12) lengthBonus += 15;
  if (password.length >= 16) lengthBonus += 10;

  const baseScore = Math.min(75, criteriaMet * 15);
  const totalScore = Math.min(100, baseScore + lengthBonus);

  let level: PasswordStrength['level'] = 'Weak';
  if (totalScore >= 90) level = 'Optimal';
  else if (totalScore >= 75) level = 'Strong';
  else if (totalScore >= 50) level = 'Good';
  else if (totalScore >= 30) level = 'Fair';

  return {
    score: totalScore,
    level,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    feedback,
  };
}
