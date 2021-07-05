import createHandler from 'middleware';
import ChatSession from 'models/chatSessions';

const handler = createHandler();

handler.get(async (req, res) => {
  if (!req.query.roomId) res.send([]);
  try {
    console.log('get req.query:', req.query);
    const chatSession = await ChatSession.findOne({
      roomId: req.query.roomId,
    });
    console.log(chatSession.messages);
    res.send(chatSession.messages);
  } catch (e) {
    console.error(e);
  }
});

handler.put(async (req, res) => {
  const data = req.body;
  if (!data) return;

  const chats = JSON.parse(data.chats);
  console.log('post chats:', chats);
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

  // const chatSession = new ChatSession({
  //   roomId: data.roomId,
  //   messages,
  // });

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
    console.log(error);
  }
});

export default handler;
