import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { assignRandomColor } from '@/lib/utils';

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
  ],
  database: process.env.DB_CONN_STR,
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    redirect: async (url, baseUrl) => {
      return url.startsWith(baseUrl)
        ? Promise.resolve(url)
        : Promise.resolve(baseUrl);
    },
    session: async (session, token) => {
      session.user.id = token.id;
      session.user.color = assignRandomColor(`${token.id}`);
      return session;
    },
  },
};

export default (req, res) => NextAuth(req, res, options);
