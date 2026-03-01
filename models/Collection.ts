import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICollection extends Document {
  title: string;
  description?: string;
  slug: string;
  owner: mongoose.Types.ObjectId;
  prompts: mongoose.Types.ObjectId[];
  isPublic: boolean;
  promptCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollectionSchema = new Schema<ICollection>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, maxlength: 500 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    prompts: [{ type: Schema.Types.ObjectId, ref: 'Prompt' }],
    isPublic: { type: Boolean, default: true },
    promptCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CollectionSchema.index({ owner: 1, createdAt: -1 });

const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
export default Collection;
