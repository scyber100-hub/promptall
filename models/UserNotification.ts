import mongoose, { Schema, Document, Model } from 'mongoose';

export type UserNotificationType = 'follow' | 'like' | 'comment' | 'comment_reply';

export interface IUserNotification extends Document {
  recipient: mongoose.Types.ObjectId;
  actor: mongoose.Types.ObjectId;
  actorName: string;
  actorUsername: string;
  actorImage?: string;
  type: UserNotificationType;
  promptId?: mongoose.Types.ObjectId;
  promptTitle?: string;
  promptSlug?: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserNotificationSchema = new Schema<IUserNotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actorName: { type: String, required: true },
    actorUsername: { type: String, required: true },
    actorImage: { type: String },
    type: {
      type: String,
      enum: ['follow', 'like', 'comment', 'comment_reply'],
      required: true,
    },
    promptId: { type: Schema.Types.ObjectId, ref: 'Prompt' },
    promptTitle: { type: String },
    promptSlug: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 내 알림 최신순 조회
UserNotificationSchema.index({ recipient: 1, createdAt: -1 });
// 미읽음 카운트 폴링
UserNotificationSchema.index({ recipient: 1, read: 1 });
// TTL — 90일 후 자동 삭제
UserNotificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });

const UserNotification: Model<IUserNotification> =
  mongoose.models.UserNotification ||
  mongoose.model<IUserNotification>('UserNotification', UserNotificationSchema);

export default UserNotification;
