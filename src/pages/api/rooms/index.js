import createHandler, { runMiddleware } from '@/middleware';
import Room from '@/models/rooms';

const handler = createHandler();

handler.get(async (req, res) => {
  await runMiddleware(req, res);

  if (!req.query.roomId) {
    res.json({
      error: {
        code: 400,
        description: 'Bad Request',
        message: 'roomId is required to be passed in query',
      },
    });
    return;
  }

  try {
    const usersInRoom = await Room.findOne({ roomId: req.query.roomId });

    if (usersInRoom) {
      res.json(usersInRoom.users);
    } else {
      res.json([]);
    }
  } catch (e) {
    console.error(e);
  }
});

handler.put(async (req, res) => {
  await runMiddleware(req, res);

  const data = req.body;
  if (!data) return;

  const users = JSON.parse(data.users);

  try {
    const result = await Room.updateOne(
      {
        roomId: data.roomId,
      },
      {
        $set: {
          users: users,
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
