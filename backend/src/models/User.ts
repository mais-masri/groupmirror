import { Schema, model, Types, InferSchemaType } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true, minlength: 1 },
  lastName: { type: String, required: true, trim: true, minlength: 1 }
}, { timestamps: true });

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };
export default model<UserDoc>('User', UserSchema);