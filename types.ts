
export interface LetterParagraph {
  text: string;
  isHighlight?: boolean;
}

export enum AppState {
  LOCKED = 'LOCKED',
  INTRO = 'INTRO',
  LETTER = 'LETTER',
  GIFT = 'GIFT'
}
