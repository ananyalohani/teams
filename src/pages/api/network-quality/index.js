import createHandler, { runMiddleware } from '@/middleware';
import NetworkQuality from '@/models/network-quality';

const handler = createHandler();

handler.get(async (req, res) => {
  await runMiddleware(req, res, true);

  if (!req.query.roomId) return;
  try {
    const result = await NetworkQuality.find({ roomId: req.query.roomId });
    // console.log(result);
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(err);
  }
});

handler.post(async (req, res) => {
  if (!req.body) return;
  try {
    const result = await NetworkQuality.updateOne(
      {
        roomId: req.body.roomId,
        userId: req.body.userId,
      },
      {
        $set: {
          audioRecv: req.body.audioRecv,
          audioSend: req.body.audioSend,
          videoRecv: req.body.videoRecv,
          videoSend: req.body.videoSend,
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
