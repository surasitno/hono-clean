import { Conversation, Message } from './conversation';

export interface ConversationRepository {
  create(conversation: Conversation): Promise<Conversation>;
  findById(id: string): Promise<Conversation | null>;
  update(conversation: Conversation): Promise<void>;
  addMessage(message: Message): Promise<Message>;
}
