import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  password?: string;
  bio?: string;
  provider: 'email' | 'google';
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  promptCount: number;
  likeCount: number;
  verificationToken?: string;
  verificationExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    emailVerified: { type: Date },
    image: { type: String },
    password: { type: String },
    bio: { type: String, maxlength: 200 },
    provider: { type: String, enum: ['email', 'google'], default: 'email' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'suspended'], default: 'active' },
    promptCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    verificationToken: { type: String },
    verificationExpires: { type: Date },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
