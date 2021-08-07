import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';

const { Schema } = mongoose;

export const AccountSchema = new Schema({
  balance: {
    type: Number,
    required: true,
  },
  deleted: { type: Boolean, default: false },
});

AccountSchema.plugin(timestamps);
AccountSchema.index({ createdAt: 1, updatedAt: 1 });

export const Account = mongoose.model('Account', AccountSchema);
