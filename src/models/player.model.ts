import { model, Schema, Document } from 'mongoose';
const mongoose = require("mongoose");

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
  score: {
    type: Number,
    required: true,
  }
});

const playerModel = model('Player', playerSchema);

export default playerModel;
