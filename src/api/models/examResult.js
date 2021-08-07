import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
import { composeWithMongoose } from 'graphql-compose-mongoose';

const { Schema } = mongoose;

export const ExamResultSchema = new Schema({
  device: { type: Schema.Types.ObjectId, ref: 'Device' },
  examNumber: {
    type: String,
    trim: true,
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  dataCubeLat: {
    type: Number,
    required: true,
  },
  dataCubeLon: {
    type: Number,
    required: true,
  },
  deleted: { type: Boolean, default: false },
});

ExamResultSchema.plugin(timestamps);
ExamResultSchema.index({ createdAt: 1, updatedAt: 1 });

export const ExamResult = mongoose.model('ExamResult', ExamResultSchema);
export const ExamResultTC = composeWithMongoose(ExamResult);
