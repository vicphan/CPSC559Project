import { model, Schema, Document } from 'mongoose';

const questionSchema: Schema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  correctAnswerIndex: {
    type: Number,
    required: true,
  },
  answers: [{
    type: String,
  }],
  index:
  {
    type: Number,
    required: true,
  }
});

const questionModel = model('Question', questionSchema);

export default questionModel;