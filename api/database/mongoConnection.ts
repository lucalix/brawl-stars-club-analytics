import mongoose from "mongoose";

import { MONGODB_DSN } from '../settings'

export default mongoose.connect(MONGODB_DSN);
