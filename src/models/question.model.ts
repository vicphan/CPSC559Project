import { model, Schema, Document } from 'mongoose';

const questionSchema: Schema = new Schema({
  prompt: {
    type: String,
    required: true,
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  wrongAnswers: [{
    type: String,
  }]
});

const questionModel = model('Question', questionSchema);

export default questionModel;
