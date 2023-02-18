import { model, Schema, Document } from 'mongoose';
const mongoose = require("mongoose");

const hostSchema: Schema = new Schema({
  game: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Game',
    required: true,
  },
});

const hostModel = model('Host', hostSchema);

export default hostModel;
