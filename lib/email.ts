import { Resend } from 'resend';

const FROM = process.env.EMAIL_FROM || 'PromptAll <noreply@promptall.net>';
const BASE_URL = process.env.NEXTAUTH_URL || 'https://promptall.net';

export async function sendVerificationEmail(email: string, token: string, locale = 'en') {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const verifyUrl = `${BASE_URL}/${locale}/auth/verify-email?token=${token}`;

  const subject = locale === 'ko' ? '[PromptAll] 이메일 인증' : '[PromptAll] Verify your email';
  const html =
    locale === 'ko'
      ? `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#4f46e5">PromptAll 이메일 인증</h2>
          <p>아래 버튼을 클릭하여 이메일을 인증해 주세요. 링크는 24시간 동안 유효합니다.</p>
          <a href="${verifyUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">이메일 인증하기</a>
          <p style="color:#6b7280;font-size:12px">버튼이 작동하지 않으면 아래 링크를 복사하여 브라우저에 붙여넣기 하세요.<br>${verifyUrl}</p>
        </div>`
      : `<div style="font-family:sans-serif;max-width:480px;margin:0 auto">
          <h2 style="color:#4f46e5">Verify your PromptAll email</h2>
          <p>Click the button below to verify your email address. The link is valid for 24 hours.</p>
          <a href="${verifyUrl}" style="display:inline-block;margin:16px 0;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold">Verify Email</a>
          <p style="color:#6b7280;font-size:12px">If the button doesn't work, copy and paste this link into your browser:<br>${verifyUrl}</p>
        </div>`;

  await resend.emails.send({ from: FROM, to: email, subject, html });
}
