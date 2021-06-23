import mongoose from 'mongoose';

export default async function dbConnect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection.db;
  }

  return mongoose.connect(process.env.DB_CONN_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
    poolSize: 10,
  });
}
