import mongoose from 'mongoose';
import getMongoDbConnection from '../database/mongoConnection'
import IPlayer from '../entities/Player';

getMongoDbConnection();

const playerSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      immutable: true
    },
    name: {
      type: String,
      required: true
    },
    iconUrl: {
      type: String,
      required: true
    },
    clubId: {
      type: String,
      ref: 'Club'
    },
    canceledAt: Date,
    battlesSyncedAt: {
      type: Date,
      default: () => new Date()
    }
  },
  { timestamps: true }
);

export default mongoose.models.Player || mongoose.model<IPlayer>("Player", playerSchema);