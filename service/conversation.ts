import { Conversation, Message } from '../domain/conversation';
import { ConversationRepository } from '../domain/repository';

export class ConversationUsecase {
    constructor(private conversationRepo: ConversationRepository) { }

    async createConversation(title?: string): Promise<Conversation> {
        const newConversation: Conversation = {
            title: title || 'New Conversation',
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        return this.conversationRepo.create(newConversation);
    }

    async sendMessage(conversationId: string, content: string): Promise<Message> {
        const conversation = await this.conversationRepo.findById(conversationId);
        if (!conversation) throw new Error('Conversation not found');

        const userMessage: Message = {
            conversationId,
            role: 'user',
            content,
            createdAt: new Date(),
        };
        await this.conversationRepo.addMessage(userMessage);

        // Update conversation timestamp
        conversation.updatedAt = new Date();
        await this.conversationRepo.update(conversation);

        // Mock Response
        const aiResponseContent = `Echo: ${content}`;
        const aiMessage: Message = {
            conversationId,
            role: 'ai',
            content: aiResponseContent,
            createdAt: new Date(),
        };

        return this.conversationRepo.addMessage(aiMessage);
    }
}
