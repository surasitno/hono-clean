import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { ConversationHandler } from '../controller/conversation';
import { connectDB, getDB } from '../infrastructure/database/mongo';
import { MongoConversationRepository } from '../infrastructure/repository/conversation';
import { ConversationUsecase } from '../service/conversation';


const app = new Hono()

app.use('*', logger());

app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

await connectDB();
const db = getDB();

//DI
const conversationRepo = new MongoConversationRepository(db);
const conversationUsecase = new ConversationUsecase(conversationRepo);
const conversationHandler = new ConversationHandler(conversationUsecase);

app.get('/', async (c) => {
  try {
    const html = await Bun.file('view/index.html').text();
    return c.html(html);
  } catch (e) {
    console.error(e);
    return c.text('Error loading UI', 500);
  }
});


app.post('/conversations', conversationHandler.createConversation);
app.post('/conversations/:id/messages', conversationHandler.sendMessage);


export default app
