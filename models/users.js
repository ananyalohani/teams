import { ObjectID } from 'bson';
import mongoose, { Schema } from 'mongoose';

const MODEL_NAME = 'User';

const schema = new Schema(
  {
    _id: {
      type: ObjectID,
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
  mongoose.model(MODEL_NAME, schema, 'users'); // if not present, create a new model
