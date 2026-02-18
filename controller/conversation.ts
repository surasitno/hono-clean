import { Context } from 'hono';
import { ConversationUsecase } from '../service/conversation';

export class ConversationHandler {
    constructor(private conversationUsecase: ConversationUsecase) { }

    createConversation = async (c: Context) => {
        let body: any = {};
        try {
            body = await c.req.json();
        } catch (e) {
            // Body might be empty
        }
        const conversation = await this.conversationUsecase.createConversation(body.title);
        return c.json(conversation, 201);
    };

    sendMessage = async (c: Context) => {
        const id = c.req.param('id');
        let body: any = {};
        try {
            body = await c.req.json();
        } catch (e) {
            return c.json({ error: 'Invalid JSON body' }, 400);
        }

        if (!body.content) {
            return c.json({ error: 'Content is required' }, 400);
        }

        try {
            const message = await this.conversationUsecase.sendMessage(id, body.content);
            return c.json(message);
        } catch (e: any) {
            if (e.message === 'Conversation not found') {
                return c.json({ error: 'Conversation not found' }, 404);
            }
            console.error(e);
            return c.json({ error: 'Internal Server Error' }, 500);
        }
    };


}
