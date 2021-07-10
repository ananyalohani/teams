import dbMiddleware from './db';
import nextConnect from 'next-connect';
import Cors from 'cors';
import { allowedURLs } from '@/lib';

export default function createHandler(...middlewares) {
  return nextConnect().use(dbMiddleware, ...middlewares);
}

// Initializing the cors middleware
const cors = Cors({
  methods: ['GET', 'PUT', 'POST'],
  origin: allowedURLs,
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export function runMiddleware(req, res) {
  return new Promise((resolve, reject) => {
    cors(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
