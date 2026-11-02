import { Document, Schema, model } from 'mongoose';

export type UserRole = 'USER' | 'ADMIN';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: UserRole;
  displayName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
      required: true
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 100
    }
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

export default model<IUser>('User', UserSchema, 'users');
