/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';

const { Schema } = mongoose;

const TYPE_MOVEMENT = {
  CREDIT: 'Credit',
  DEBIT: 'Debit',
};

export const AccountMovementSchema = new Schema({
  serialNumber: {
    type: String,
    trim: true,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: [TYPE_MOVEMENT.CREDIT, TYPE_MOVEMENT.DEBIT],
    required: true,
  },
  deleted: { type: Boolean, default: false },
});

AccountMovementSchema.plugin(timestamps);
AccountMovementSchema.index({ createdAt: 1, updatedAt: 1 });
// AccountMovementSchema.virtual('fullName').get(function () {
//   return `${this.firstName} ${this.lastName}`;
// });

export const AccountMovement = mongoose.model('AccountMovement', AccountMovementSchema);
export const AccountMovementTC = composeWithMongoose(AccountMovement);
export const typeMovement = TYPE_MOVEMENT;
