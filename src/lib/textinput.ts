export function getHighlightedPrompt(prompt: string, userInput: string): Array<{char: string, correct: boolean}> {
  return prompt.split('').map((char, i) => ({
    char,
    correct: userInput[i] === char
  }));
}