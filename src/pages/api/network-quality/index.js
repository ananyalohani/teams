import createHandler from '@/middleware';
import NetworkQuality from '@/models/network-quality';

const handler = createHandler();

handler.get(async (req, res) => {
  if (!req.query.roomId) return;
  try {
    NetworkQuality.findAll({ roomId: req.query.roomId }, (err, result) => {
      if (err) res.status(500).send(err);
      res.json(result);
    });
  } catch (e) {
    console.error(e);
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
