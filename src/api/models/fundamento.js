import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';

const { Schema } = mongoose;

export const FundamentoSchema = new Schema({
  p_l: Number,
  p_vp: Number,
  dividentoYIELD: Number,
  margemEBIT: Number,
  liquidezCorrete: Number,
  liquidez2Meses: Number,
  roe: Number,
  crescimento: Number,
  deleted: { type: Boolean, default: false },
});

FundamentoSchema.plugin(mongooseUniqueValidator);
FundamentoSchema.plugin(timestamps);
FundamentoSchema.index({ createdAt: 1, updatedAt: 1 });

export const Fundamento = mongoose.model('Fundamento', FundamentoSchema);
export const FundamentoTC = composeWithMongoose(Fundamento, {});
