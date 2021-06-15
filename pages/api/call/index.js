import { getSession } from 'next-auth/client';

export default async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    res.send({
      content: 'Welcome to the secret page',
    });
  } else {
    res.send({
      error: 'You need to be signed in',
    });
  }
};
