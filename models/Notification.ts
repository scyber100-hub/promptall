import mongoose, { Schema, Document, Model } from 'mongoose';

export type NotificationType = 'high_report' | 'new_user' | 'prompt_hidden';

export interface INotification extends Document {
  type: NotificationType;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    type: { type: String, enum: ['high_report', 'new_user', 'prompt_hidden'], required: true },
    message: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

NotificationSchema.index({ read: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
