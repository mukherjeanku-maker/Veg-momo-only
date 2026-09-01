export interface ChatMessage {
  id: string;
  sender: 'me' | 'her';
  text: string;
  delayMs?: number;
}

export type PlayfulAnswer = 'obviously' | 'maybe' | null;
export type BengaliAnswer = 'yes' | 'maybe' | null;
