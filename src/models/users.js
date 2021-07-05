import { ObjectId } from 'bson';
import mongoose, { Schema } from 'mongoose';

const MODEL_NAME = 'User';

export const userSchema = new Schema(
  {
    _id: {
      type: ObjectId,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models[MODEL_NAME] || // look for this model is the mongoose list of models
  mongoose.model(MODEL_NAME, userSchema, 'users'); // if not present, create a new model
