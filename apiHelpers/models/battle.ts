import mongoose from 'mongoose';
import getMongoDbConnection from '../database/mongoConnection';

getMongoDbConnection();

const battleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      immutable: true
    },
    groupId: String,
    isClubLeague: Boolean,
    isPowerLeague: Boolean,
    isMainBattle: Boolean,
    event: {
      id: Number,
      mode: String,
      map: String
    },
    battle: {
      type: { type: String },
      result: String,
      duration: Number,
      trophyChange: Number,
      starPlayer: {
        tag: String
      },
      teams: {
        teamOne: [
          {
            tag: String,
            name: String,
            brawler: {
              id: Number,
              name: String,
              power: Number,
              trophies: Number,
            },
            _id: false
          }
        ],
        teamTwo: [
          {
            tag: String,
            name: String,
            brawler: {
              id: Number,
              name: String,
              power: Number,
              trophies: Number,
            },
            _id: false
          }
        ]
      },
    },
    processedAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.models.Battle || mongoose.model("Battle", battleSchema);