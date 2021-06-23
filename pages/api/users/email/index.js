import createHandler from 'middleware';
import User from 'models/users';

const handler = createHandler();

handler.get(async (req, res) => {
  let users;
  if (req.query.value) {
    users = await User.find({ email: req.query.value }).exec();
  } else {
    users = {};
  }
  res.status(200).json(users);
});

export default handler;
