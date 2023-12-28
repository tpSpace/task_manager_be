import { Schema, Document, model } from 'mongoose';

export interface UserDocument extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
});

const User = model<UserDocument>('User', userSchema);

export default User;
