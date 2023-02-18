import { model, Schema, Document } from 'mongoose';

const gameSchema: Schema = new Schema({
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const gameModel = model('Game', gameSchema);

export default gameModel;
