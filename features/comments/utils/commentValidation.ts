export const commentValidationRules = {
  maxRepeatedWordOccurrences: 4,
  maxWords: 150,
  minCharacters: 40,
  minUniqueWords: 8,
  minWords: 10,
};

type CommentValidationResult = {
  error: string | null;
  isValid: boolean;
};

export type CommentStats = {
  characterCount: number;
  wordCount: number;
};

function getWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean);
}

function normalizeWord(word: string) {
  return word
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function hasSuspiciousLongWord(words: string[]) {
  return words.some((word) => {
    const normalizedWord = normalizeWord(word);

    return normalizedWord.length > 28;
  });
}

function hasRepeatedPattern(words: string[]) {
  return words.some((word) => {
    const normalizedWord = normalizeWord(word);

    return /(.{2,5})\1{3,}/.test(normalizedWord);
  });
}

function hasTooManyRepeatedWords(words: string[]) {
  const occurrences = new Map<string, number>();

  return words.some((word) => {
    const normalizedWord = normalizeWord(word);

    if (!normalizedWord) {
      return false;
    }

    const nextCount = (occurrences.get(normalizedWord) ?? 0) + 1;
    occurrences.set(normalizedWord, nextCount);

    return nextCount > commentValidationRules.maxRepeatedWordOccurrences;
  });
}

export function getCommentStats(text: string): CommentStats {
  return {
    characterCount: text.trim().length,
    wordCount: getWords(text).length,
  };
}

export function validateCommentText(text: string): CommentValidationResult {
  const cleanText = text.trim();
  const words = getWords(cleanText);
  const uniqueWords = new Set(words.map(normalizeWord).filter(Boolean));

  if (!cleanText) {
    return {
      error: "Escribe un comentario antes de enviarlo.",
      isValid: false,
    };
  }

  if (words.length < commentValidationRules.minWords) {
    return {
      error: `Escribe al menos ${commentValidationRules.minWords} palabras para explicar tu sugerencia.`,
      isValid: false,
    };
  }

  if (cleanText.length < commentValidationRules.minCharacters) {
    return {
      error: `Tu sugerencia debe tener al menos ${commentValidationRules.minCharacters} caracteres.`,
      isValid: false,
    };
  }

  if (words.length > commentValidationRules.maxWords) {
    return {
      error: `La sugerencia debe tener maximo ${commentValidationRules.maxWords} palabras.`,
      isValid: false,
    };
  }

  if (uniqueWords.size < commentValidationRules.minUniqueWords) {
    return {
      error: "Escribe una sugerencia mas clara, con mas detalle y menos palabras repetidas.",
      isValid: false,
    };
  }

  if (hasTooManyRepeatedWords(words) || hasSuspiciousLongWord(words) || hasRepeatedPattern(words)) {
    return {
      error: "Escribe una sugerencia real, evitando texto repetido o de relleno.",
      isValid: false,
    };
  }

  return {
    error: null,
    isValid: true,
  };
}
