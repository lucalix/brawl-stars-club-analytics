import mongoose from 'mongoose';
import getMongoDbConnection from '../database/mongoConnection'
import IClub from '../entities/Club'

getMongoDbConnection();

const clubSchema = new mongoose.Schema({
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
  groupId: String,
  canceledAt: Date,
  createdAt: {
    type: Date,
    default: () => new Date(),
    immutable: true
  },
  updateAt: {
    type: Date,
    default: () => new Date()
  }
});

export default mongoose.models.Club || mongoose.model<IClub>("Club", clubSchema);