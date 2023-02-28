import { model, Schema, Document } from 'mongoose';
import { Game } from '@interfaces/games.interface';

const gameSchema: Schema = new Schema({
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const gameModel = model<Game & Document>('Game', gameSchema);

export default gameModel;
