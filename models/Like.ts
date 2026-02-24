import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ILike extends Document {
  userId: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: 'prompt' | 'comment';
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    targetType: { type: String, enum: ['prompt', 'comment'], required: true },
  },
  { timestamps: true }
);

LikeSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

const Like: Model<ILike> = mongoose.models.Like || mongoose.model<ILike>('Like', LikeSchema);
export default Like;
