export interface RequestMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface Message {
  id?: string;
  conversationId: string;
  role: 'user' | 'ai';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id?: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
