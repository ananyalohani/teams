import createHandler from '@/middleware';
import NetworkQuality from '@/models/network-quality';

const handler = createHandler();

handler.get(async (req, res) => {
  try {
    NetworkQuality.find({}, (err, result) => {
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
    const netQualObj = new NetworkQuality(req.body);
    const result = await netQualObj.save();
  } catch (e) {
    console.error(e);
  }
});

export default handler;
