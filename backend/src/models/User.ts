import { Schema, model, Types, InferSchemaType, Document } from 'mongoose';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true, minlength: 1 },
  lastName: { type: String, required: true, trim: true, minlength: 1 }
}, { timestamps: true });

export interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUser {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export interface PublicUser {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPayload {
  id: string;
  email: string;
  username: string;
}

export default model<UserDoc>('User', UserSchema);