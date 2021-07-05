import { ObjectId } from 'bson';
import mongoose, { Schema } from 'mongoose';

const MODEL_NAME = 'Message';

export const messageSchema = new Schema(
  {
    user: {
      name: String,
      id: ObjectId,
      color: String,
      email: String,
      image: String,
    },
    message: {
      body: String,
      date: {
        type: Date,
        default: Date.now,
      },
      time: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models[MODEL_NAME] || // look for this model is the mongoose list of models
  mongoose.model(MODEL_NAME, messageSchema, 'messages'); // if not present, create a new model
