import createHandler from 'middleware';
import User from 'models/users';

const handler = createHandler();

handler.get(async (req, res) => {
  const users = await User.find({}).exec();
  res.status(200).json(users);
});

export default handler;
