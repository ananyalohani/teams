import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';

const options = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Providers.Email({
    //   server: {
    //     host: '',
    //     port: '',
    //     auth: {
    //       user: '',
    //       pass: '',
    //     },
    //   },
    //   from: '',
    // }),
  ],
  // callbacks: {
  //   jwt: async (token, user, account, profile, isNewUser) => {
  //     if (user) {
  //       token.uid = user.id;
  //     }
  //     return Promise.resolve(token);
  //   },
  //   session: async (session, user) => {
  //     session.user.uid = user.uid;
  //     return Promise.resolve(session);
  //   },
  // },
};

export default (req, res) => NextAuth(req, res, options);
