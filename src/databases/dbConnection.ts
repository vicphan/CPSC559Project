import { MONGODB_URI } from '../config';

export const dbConnection = {
  url: MONGODB_URI,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
