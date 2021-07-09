import createHandler, { runMiddleware } from '@/middleware';
import UserRoom from '@/models/user-rooms';

const handler = createHandler();

handler.get(async (req, res) => {
  await runMiddleware(req, res);

  if (!req.query.userId) res.json([]);

  try {
    const userRooms = await UserRoom.findOne({
      userId: req.query.userId,
    });

    if (userRooms) {
      res.json(userRooms.rooms);
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
  const rooms = JSON.parse(data.rooms);

  try {
    const result = await UserRoom.updateOne(
      {
        userId: data.userId,
      },
      {
        $set: {
          rooms: rooms,
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
