import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBookmark extends Document {
  userId: mongoose.Types.ObjectId;
  promptId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const BookmarkSchema = new Schema<IBookmark>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, promptId: 1 }, { unique: true });
BookmarkSchema.index({ userId: 1, createdAt: -1 });

const Bookmark: Model<IBookmark> = mongoose.models.Bookmark || mongoose.model<IBookmark>('Bookmark', BookmarkSchema);
export default Bookmark;
