import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import { AccountSchema } from './account.js';

const { Schema } = mongoose;

export const Type = {
  COVID19: 'COVID_19',
};

export const DeviceSchema = new Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true,
  },
  locate: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [Type.COVID19],
    default: Type.COVID19,
    // required: true,
  },
  account: {
    type: AccountSchema,
  },
  customer: { type: Schema.Types.ObjectId, ref: 'Customer' },
  deleted: { type: Boolean, default: false },
});

DeviceSchema.plugin(mongooseUniqueValidator);
DeviceSchema.plugin(timestamps);
DeviceSchema.index({ createdAt: 1, updatedAt: 1 });

export const Device = mongoose.model('Device', DeviceSchema);
export const DeviceTC = composeWithMongoose(Device, {});
