export type CharStatus = 'completed' | 'current' | 'incorrect' | 'pending';

export interface HighlightedChar {
  char: string;
  status: CharStatus;
}

export function getHighlightedPrompt(prompt: string, userInput: string): HighlightedChar[] {
  const promptWords = prompt.split(' ');
  const inputWords = userInput.split(' ');
  let charIndex = 0;
  return promptWords.flatMap((word, wIdx) => {
    const inputWord = inputWords[wIdx] || "";
    const wordCompleted = inputWord === word;
    return word.split('').map((char, i) => {
      let status: CharStatus;
      if (wIdx < inputWords.length - 1 || (wordCompleted && wIdx === inputWords.length - 1)) {
        status = 'completed';
      } else if (wIdx === inputWords.length - 1) {
        if (i < inputWord.length) {
          status = inputWord[i] === char ? 'completed' : 'incorrect';
        } else if (i === inputWord.length) {
          status = 'current';
        } else {
          status = 'pending';
        }
      } else {
        status = 'pending';
      }
      charIndex++;
      return { char, status };
    }).concat(wIdx < promptWords.length - 1 ? [{ char: ' ', status: 'pending' }] : []);
  });
}