import createHandler, { runMiddleware } from '@/middleware';
import ChatSession from '@/models/chat-sessions';

const handler = createHandler();

handler.get(async (req, res) => {
  await runMiddleware(req, res);

  if (!req.query.roomId) res.json([]);
  try {
    const chatSession = await ChatSession.findOne({
      roomId: req.query.roomId,
    });
    if (chatSession) {
      res.json(chatSession.messages);
    } else res.json([]);
  } catch (e) {
    console.error(e);
  }
});

handler.put(async (req, res) => {
  await runMiddleware(req, res);

  const data = req.body;
  if (!data) return;

  const chats = JSON.parse(data.chats);
  const messages = [];
  chats.forEach((chat) => {
    const { name, id, color, email, image } = chat.user;
    const { body, time } = chat.message;
    messages.push({
      user: {
        name,
        id,
        color,
        email,
        image,
      },
      message: {
        body,
        time,
      },
    });
  });

  try {
    const result = await ChatSession.updateOne(
      { roomId: data.roomId },
      {
        $set: {
          messages: messages,
        },
      },
      {
        upsert: true,
      }
    );
    res.send(result);
  } catch (e) {
    console.error(e);
  }
});

export default handler;
