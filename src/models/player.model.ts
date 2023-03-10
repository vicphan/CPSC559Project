import { model, Schema, Document } from 'mongoose';
import { Player } from '../interfaces/players.interface';
const mongoose = require('mongoose');

const playerSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true,
  },
  scores: [{
    type: Number,
  }],
  active: {
    type: Boolean,
  },
});

const playerModel = model<Player & Document>('Player', playerSchema);

export default playerModel;
