import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';

const { Schema } = mongoose;

export const UsuarioSchema = new Schema({
  nome: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true,
  },
  senha: {
    type: String,
    trim: true,
    required: true,
  },
  deleted: { type: Boolean, default: false },
});

UsuarioSchema.plugin(timestamps);
UsuarioSchema.index({ createdAt: 1, updatedAt: 1 });

export const Usuario = mongoose.model('Usuario', UsuarioSchema);
export const UsuarioTC = composeWithMongoose(Usuario, {});
