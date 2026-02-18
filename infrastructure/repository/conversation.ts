import { Collection, Db, ObjectId } from 'mongodb';
import { Conversation, Message } from '../../domain/conversation';
import { ConversationRepository } from '../../domain/repository';

export class MongoConversationRepository implements ConversationRepository {
  private conversationCollection: Collection;
  private messageCollection: Collection;

  constructor(db: Db) {
    this.conversationCollection = db.collection('conversations');
    this.messageCollection = db.collection('messages');
  }

  async create(conversation: Conversation): Promise<Conversation> {
    const dbModel = {
      title: conversation.title,
      createdAt: conversation.createdAt,
      updatedAt: conversation.updatedAt,
    };
    const result = await this.conversationCollection.insertOne(dbModel);
    return { ...conversation, id: result.insertedId.toString() };
  }

  async findById(id: string): Promise<Conversation | null> {
    if (!ObjectId.isValid(id)) return null;
    const dbModelData = await this.conversationCollection.findOne({ _id: new ObjectId(id) });
    if (!dbModelData) return null;
    return this.mapToConversation(dbModelData);
  }

  async update(conversation: Conversation): Promise<void> {
    if (!conversation.id || !ObjectId.isValid(conversation.id)) return;
    await this.conversationCollection.updateOne(
      { _id: new ObjectId(conversation.id) },
      { $set: { title: conversation.title, updatedAt: conversation.updatedAt } }
    );
  }

  async addMessage(message: Message): Promise<Message> {
    const dbModel = {
      conversationId: message.conversationId,
      role: message.role,
      content: message.content,
      createdAt: message.createdAt,
    };
    const result = await this.messageCollection.insertOne(dbModel);
    return { ...message, id: result.insertedId.toString() };
  }

  private mapToConversation(dbModel: any): Conversation {
    return {
      id: dbModel._id.toString(),
      title: dbModel.title,
      createdAt: dbModel.createdAt,
      updatedAt: dbModel.updatedAt,
    };
  }
}
