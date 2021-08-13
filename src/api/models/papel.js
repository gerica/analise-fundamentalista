import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { FundamentoSchema } from './fundamento.js';

const { Schema } = mongoose;

export const PapelSchema = new Schema({
  nome: String,
  papel: String,
  fundamentos: [{ type: FundamentoSchema }],
  deleted: { type: Boolean, default: false },
});

PapelSchema.plugin(timestamps);
PapelSchema.index({ createdAt: 1, updatedAt: 1 });

export const Papel = mongoose.model('Papel', PapelSchema);
export const PapelTC = composeWithMongoose(Papel, {});
