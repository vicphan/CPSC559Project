import { model, Schema, Document } from 'mongoose';
import { Player } from '../interfaces/players.interface';
const mongoose = require('mongoose');

const playerSchema: Schema = new Schema({
  playerID: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  joinCode: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true,
  },
  active: {
    type: Boolean,
  },
});

const playerModel = model<Player & Document>('Player', playerSchema);

export default playerModel;
