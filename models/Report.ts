import mongoose, { Schema, Document, Model } from 'mongoose';

export type ReportReason = 'spam' | 'inappropriate' | 'copyright' | 'other';

export interface IReport extends Document {
  promptId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  reason: ReportReason;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, enum: ['spam', 'inappropriate', 'copyright', 'other'], required: true },
  },
  { timestamps: true }
);

// 복합 인덱스: 로그인 사용자는 같은 프롬프트에 중복 신고 방지
ReportSchema.index({ promptId: 1, userId: 1 }, { unique: true, sparse: true });

const Report: Model<IReport> = mongoose.models.Report || mongoose.model<IReport>('Report', ReportSchema);
export default Report;
