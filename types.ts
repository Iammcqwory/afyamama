
export enum Sender {
  User = 'user',
  AI = 'ai',
  Warning = 'warning',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: number;
  reactions?: Record<string, number>;
}