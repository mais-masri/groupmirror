import { Schema, model, Types, InferSchemaType } from 'mongoose';

const GroupSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  owner: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User', index: true }],
  isPrivate: { type: Boolean, default: false }
}, { timestamps: true });

GroupSchema.index({ owner: 1, name: 1 }, { unique: true });

export type GroupDoc = InferSchemaType<typeof GroupSchema> & { _id: Types.ObjectId };
export default model<GroupDoc>('Group', GroupSchema);