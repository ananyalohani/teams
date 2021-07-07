import mongoose, { Schema } from 'mongoose';
import { ObjectId } from 'bson';
import { userSchema } from './users';

const MODEL_NAME = 'UserRoom';

export const userRoomSchema = new Schema({
  userId: ObjectId,
  rooms: [
    {
      roomId: String,
      date: Date,
    },
  ],
});

export default mongoose.models[MODEL_NAME] || // look for this model is the mongoose list of models
  mongoose.model(MODEL_NAME, userRoomSchema, 'user-rooms'); // if not present, create a new model
