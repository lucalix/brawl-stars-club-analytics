import mongoose from "mongoose";

import { MONGODB_DSN } from '../settings'

let mongoConnection: object;


export default function getMongoDbConnection() {
  if (mongoConnection) {
    return mongoConnection;
  }

  mongoConnection = mongoose.connect(MONGODB_DSN);
  console.log('New Connection Created');

  return mongoConnection;
}


