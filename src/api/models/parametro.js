import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';

const { Schema } = mongoose;

export const ParametroSchema = new Schema({
  descricao: String,
  ativo: Boolean,
  valorRef: Number,
  maiorMelhor: Boolean,
  deleted: { type: Boolean, default: false },
});

ParametroSchema.plugin(timestamps);
ParametroSchema.index({ createdAt: 1, updatedAt: 1 });

export const Parametro = mongoose.model('Parametro', ParametroSchema);
export const ParametroTC = composeWithMongoose(Parametro, {});
