import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  promptId: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  authorName: string;
  authorUsername: string;
  authorImage?: string;
  content: string;
  parentId?: mongoose.Types.ObjectId;
  replyCount: number;
  likeCount: number;
  status: 'active' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema = new Schema<IComment>(
  {
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    authorName: { type: String, required: true },
    authorUsername: { type: String, required: true },
    authorImage: { type: String },
    content: { type: String, required: true, maxlength: 1000 },
    parentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    replyCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
  },
  { timestamps: true }
);

CommentSchema.index({ promptId: 1, parentId: 1, createdAt: -1 });
CommentSchema.index({ author: 1 });

const Comment: Model<IComment> = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
export default Comment;
