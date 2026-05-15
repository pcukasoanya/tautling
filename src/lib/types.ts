
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  mastered: boolean;
  lastReviewedAt?: number;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
  category: string;
}

export type MasteryStatus = 'new' | 'learning' | 'mastered';
