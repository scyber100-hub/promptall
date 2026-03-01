import { connectDB } from './mongodb';
import UserNotification, { UserNotificationType } from '@/models/UserNotification';

interface CreateNotificationParams {
  recipient: string;
  actor: string;
  actorName: string;
  actorUsername: string;
  actorImage?: string;
  type: UserNotificationType;
  promptId?: string;
  promptTitle?: string;
  promptSlug?: string;
}

export async function createNotification(params: CreateNotificationParams): Promise<void> {
  // 자기 자신에게는 알림 생성 안 함
  if (params.recipient === params.actor) return;

  try {
    await connectDB();
    await UserNotification.create({
      recipient: params.recipient,
      actor: params.actor,
      actorName: params.actorName,
      actorUsername: params.actorUsername,
      actorImage: params.actorImage,
      type: params.type,
      promptId: params.promptId,
      promptTitle: params.promptTitle,
      promptSlug: params.promptSlug,
    });
  } catch (err) {
    // fire-and-forget — 본 API 응답에 영향 없음
    console.error('[createNotification] failed:', err);
  }
}
