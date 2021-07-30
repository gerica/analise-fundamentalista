import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';

const { Schema } = mongoose;

export const AccountSchema = new Schema({
  serialNumber: {
    type: String,
    trim: true,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
  },
  deleted: { type: Boolean, default: false },
});

AccountSchema.plugin(timestamps);
AccountSchema.index({ createdAt: 1, updatedAt: 1 });

export const Account = mongoose.model('Account', AccountSchema);
export const AccountTC = composeWithMongoose(Account);
