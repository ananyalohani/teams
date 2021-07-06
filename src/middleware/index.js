import dbMiddleware from './db';
import nextConnect from 'next-connect';

export default function createHandler(...middlewares) {
  return nextConnect().use(dbMiddleware, ...middlewares);
}

function initMiddleware(middleware) {
  return (req, res) =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
