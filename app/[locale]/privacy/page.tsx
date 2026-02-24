import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | PromptAll',
  description: 'Learn how PromptAll collects, uses, and protects your personal information.',
};

const CONTENT = {
  en: {
    badge: 'Legal',
    title: 'Privacy Policy',
    updated: 'Last updated: February 24, 2026',
    intro: 'Welcome to PromptAll ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit promptall.net.',
    sections: [
      {
        title: '1. Information We Collect',
        subsections: [
          {
            title: '1.1 Information You Provide',
            items: [
              '<strong>Account Information:</strong> Name, email address, username, and password when you register.',
              '<strong>Profile Information:</strong> Optional bio or avatar image you add to your profile.',
              '<strong>Content:</strong> Prompts, descriptions, tags, comments, and result images you submit.',
              '<strong>Communications:</strong> Messages you send to us for support or feedback.',
            ],
          },
          {
            title: '1.2 Automatically Collected Information',
            items: [
              '<strong>Usage Data:</strong> Pages visited, prompts viewed, actions taken (likes, bookmarks, copies).',
              '<strong>Device Information:</strong> Browser type, operating system, IP address, and referring URLs.',
              '<strong>Cookies:</strong> Session cookies for authentication and preference cookies for language settings.',
            ],
          },
          {
            title: '1.3 Third-Party Sign-In',
            text: 'If you sign in with Google, we receive your name, email address, and profile picture from Google. We do not receive your Google password.',
          },
        ],
      },
      {
        title: '2. How We Use Your Information',
        items: [
          'Provide, operate, and maintain the PromptAll platform',
          'Create and manage your account',
          'Display your prompts and public profile to other users',
          'Send service-related emails (account verification, password reset)',
          'Analyze usage trends to improve our service',
          'Detect and prevent fraud, abuse, or security incidents',
          'Comply with legal obligations',
        ],
        note: 'We do <strong>not</strong> sell your personal data to third parties.',
      },
      {
        title: '3. Cookies and Tracking',
        intro: 'We use the following types of cookies:',
        cookies: [
          { type: 'Essential', purpose: 'Authentication session', duration: 'Session' },
          { type: 'Preference', purpose: 'Language selection', duration: '1 year' },
          { type: 'Analytics', purpose: 'Google Analytics (anonymous usage stats)', duration: '2 years' },
        ],
        note: 'You can disable cookies in your browser settings. Note that some features may not function properly without essential cookies.',
      },
      {
        title: '4. Third-Party Services',
        intro: 'We use the following third-party services which may process your data under their own privacy policies:',
        services: [
          { name: 'Google Analytics', desc: 'Anonymous usage analytics', url: 'https://policies.google.com/privacy', label: 'Google Privacy Policy' },
          { name: 'Google OAuth', desc: 'Optional sign-in', url: 'https://policies.google.com/privacy', label: 'Google Privacy Policy' },
          { name: 'Cloudinary', desc: 'Image storage and delivery', url: 'https://cloudinary.com/privacy', label: 'Cloudinary Privacy Policy' },
          { name: 'MongoDB Atlas', desc: 'Database hosting', url: 'https://www.mongodb.com/legal/privacy-policy', label: 'MongoDB Privacy Policy' },
          { name: 'Vercel', desc: 'Hosting and deployment', url: 'https://vercel.com/legal/privacy-policy', label: 'Vercel Privacy Policy' },
          { name: 'Google AdSense', desc: 'Advertising (when enabled)', url: 'https://policies.google.com/privacy', label: 'Google Privacy Policy' },
        ],
      },
      {
        title: '5. Data Retention',
        items: [
          '<strong>Account data:</strong> Retained while your account is active. Deleted within 30 days of account deletion request.',
          '<strong>Public prompts:</strong> Retained until you delete them or request account deletion.',
          '<strong>Usage logs:</strong> Retained for up to 90 days for security and debugging purposes.',
        ],
      },
      {
        title: '6. Your Rights',
        intro: 'Depending on your location, you may have the following rights:',
        items: [
          '<strong>Access:</strong> Request a copy of the personal data we hold about you.',
          '<strong>Rectification:</strong> Correct inaccurate or incomplete data.',
          '<strong>Erasure:</strong> Request deletion of your account and associated data.',
          '<strong>Portability:</strong> Receive your data in a structured, machine-readable format.',
          '<strong>Opt-out:</strong> Unsubscribe from marketing emails at any time.',
        ],
        contact: 'To exercise these rights, contact us at <strong>privacy@promptall.net</strong>.',
      },
      {
        title: "7. Children's Privacy",
        text: "PromptAll is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided personal data, we will delete it promptly.",
      },
      {
        title: '8. International Data Transfers',
        text: 'PromptAll operates globally. Your data may be stored and processed in the United States or other countries where our service providers operate. We ensure appropriate safeguards are in place for such transfers.',
      },
      {
        title: '9. Changes to This Policy',
        text: 'We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date. Continued use of PromptAll after changes constitutes acceptance of the revised policy.',
      },
      {
        title: '10. Contact Us',
        intro: 'If you have questions or concerns about this Privacy Policy, please contact us:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    cookieHeaders: ['Type', 'Purpose', 'Duration'],
    backHome: '← Back to Home',
    toTerms: 'Terms of Service →',
  },
  ko: {
    badge: '법적 고지',
    title: '개인정보처리방침',
    updated: '최종 업데이트: 2026년 2월 24일',
    intro: 'PromptAll("당사", "우리")에 오신 것을 환영합니다. 당사는 귀하의 개인정보와 프라이버시를 보호하기 위해 최선을 다하고 있습니다. 본 개인정보처리방침은 귀하가 promptall.net을 방문할 때 당사가 어떻게 정보를 수집, 사용, 보호하는지 설명합니다.',
    sections: [
      {
        title: '1. 수집하는 정보',
        subsections: [
          {
            title: '1.1 귀하가 제공하는 정보',
            items: [
              '<strong>계정 정보:</strong> 회원가입 시 이름, 이메일 주소, 사용자명, 비밀번호.',
              '<strong>프로필 정보:</strong> 선택적으로 추가하는 자기소개 또는 프로필 이미지.',
              '<strong>콘텐츠:</strong> 제출하는 프롬프트, 설명, 태그, 댓글, 결과 이미지.',
              '<strong>문의:</strong> 지원 또는 피드백을 위해 보내는 메시지.',
            ],
          },
          {
            title: '1.2 자동 수집 정보',
            items: [
              '<strong>사용 데이터:</strong> 방문한 페이지, 조회한 프롬프트, 수행한 작업(좋아요, 북마크, 복사).',
              '<strong>기기 정보:</strong> 브라우저 종류, 운영 체제, IP 주소, 유입 URL.',
              '<strong>쿠키:</strong> 인증을 위한 세션 쿠키 및 언어 설정을 위한 선호 쿠키.',
            ],
          },
          {
            title: '1.3 소셜 로그인',
            text: 'Google로 로그인하는 경우, Google로부터 이름, 이메일 주소, 프로필 사진을 제공받습니다. Google 비밀번호는 제공받지 않습니다.',
          },
        ],
      },
      {
        title: '2. 정보 이용 목적',
        items: [
          'PromptAll 플랫폼의 제공, 운영 및 유지',
          '계정 생성 및 관리',
          '다른 사용자에게 귀하의 프롬프트 및 공개 프로필 표시',
          '서비스 관련 이메일 발송(계정 인증, 비밀번호 재설정)',
          '서비스 개선을 위한 사용 추세 분석',
          '사기, 남용 또는 보안 사고 탐지 및 예방',
          '법적 의무 이행',
        ],
        note: '당사는 귀하의 개인 데이터를 제3자에게 <strong>판매하지 않습니다</strong>.',
      },
      {
        title: '3. 쿠키 및 추적',
        intro: '당사는 다음과 같은 쿠키를 사용합니다:',
        cookies: [
          { type: '필수', purpose: '인증 세션', duration: '세션' },
          { type: '선호', purpose: '언어 설정', duration: '1년' },
          { type: '분석', purpose: 'Google Analytics (익명 사용 통계)', duration: '2년' },
        ],
        note: '브라우저 설정에서 쿠키를 비활성화할 수 있습니다. 필수 쿠키 없이는 일부 기능이 정상적으로 작동하지 않을 수 있습니다.',
      },
      {
        title: '4. 제3자 서비스',
        intro: '당사는 자체 개인정보처리방침에 따라 데이터를 처리할 수 있는 다음 제3자 서비스를 이용합니다:',
        services: [
          { name: 'Google Analytics', desc: '익명 사용 분석', url: 'https://policies.google.com/privacy', label: 'Google 개인정보처리방침' },
          { name: 'Google OAuth', desc: '선택적 소셜 로그인', url: 'https://policies.google.com/privacy', label: 'Google 개인정보처리방침' },
          { name: 'Cloudinary', desc: '이미지 저장 및 전송', url: 'https://cloudinary.com/privacy', label: 'Cloudinary 개인정보처리방침' },
          { name: 'MongoDB Atlas', desc: '데이터베이스 호스팅', url: 'https://www.mongodb.com/legal/privacy-policy', label: 'MongoDB 개인정보처리방침' },
          { name: 'Vercel', desc: '호스팅 및 배포', url: 'https://vercel.com/legal/privacy-policy', label: 'Vercel 개인정보처리방침' },
          { name: 'Google AdSense', desc: '광고(활성화된 경우)', url: 'https://policies.google.com/privacy', label: 'Google 개인정보처리방침' },
        ],
      },
      {
        title: '5. 데이터 보유',
        items: [
          '<strong>계정 데이터:</strong> 계정이 활성화된 동안 보유. 계정 삭제 요청 후 30일 이내 삭제.',
          '<strong>공개 프롬프트:</strong> 귀하가 삭제하거나 계정 삭제를 요청할 때까지 보유.',
          '<strong>사용 로그:</strong> 보안 및 디버깅 목적으로 최대 90일간 보유.',
        ],
      },
      {
        title: '6. 귀하의 권리',
        intro: '거주 지역에 따라 다음과 같은 권리를 가질 수 있습니다:',
        items: [
          '<strong>열람권:</strong> 당사가 보유한 개인 데이터의 사본을 요청할 수 있습니다.',
          '<strong>정정권:</strong> 부정확하거나 불완전한 데이터를 수정할 수 있습니다.',
          '<strong>삭제권:</strong> 계정 및 관련 데이터의 삭제를 요청할 수 있습니다.',
          '<strong>이동성:</strong> 구조화된 기계 판독 가능한 형식으로 데이터를 받을 수 있습니다.',
          '<strong>수신 거부:</strong> 언제든지 마케팅 이메일 수신을 거부할 수 있습니다.',
        ],
        contact: '이러한 권리를 행사하려면 <strong>privacy@promptall.net</strong>으로 문의하세요.',
      },
      {
        title: '7. 아동 개인정보 보호',
        text: 'PromptAll은 13세 미만의 개인을 대상으로 하지 않습니다. 13세 미만 아동의 개인정보를 의도적으로 수집하지 않습니다. 13세 미만 아동이 개인 데이터를 제공한 사실을 인지하는 경우, 즉시 삭제합니다.',
      },
      {
        title: '8. 국제 데이터 이전',
        text: 'PromptAll은 전 세계적으로 운영됩니다. 귀하의 데이터는 미국 또는 당사 서비스 제공업체가 운영하는 다른 국가에서 저장 및 처리될 수 있습니다. 당사는 이러한 이전에 적절한 보호 조치를 마련합니다.',
      },
      {
        title: '9. 방침 변경',
        text: '당사는 이 개인정보처리방침을 수시로 업데이트할 수 있습니다. 중요한 변경 사항이 있을 경우 이 페이지에 새 방침을 게시하고 "최종 업데이트" 날짜를 변경하여 알려드립니다. 변경 후 PromptAll을 계속 이용하면 개정된 방침에 동의하는 것으로 간주됩니다.',
      },
      {
        title: '10. 문의하기',
        intro: '본 개인정보처리방침에 대한 질문이나 우려 사항이 있으시면 문의해 주세요:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    cookieHeaders: ['유형', '목적', '기간'],
    backHome: '← 홈으로',
    toTerms: '이용약관 →',
  },
  ja: {
    badge: '法的情報',
    title: 'プライバシーポリシー',
    updated: '最終更新: 2026年2月24日',
    intro: 'PromptAll（以下「当社」）へようこそ。当社は、お客様の個人情報とプライバシーの保護に取り組んでいます。本プライバシーポリシーは、お客様がpromptall.netをご利用の際に当社がどのように情報を収集、使用、保護するかを説明します。',
    sections: [
      {
        title: '1. 収集する情報',
        subsections: [
          {
            title: '1.1 お客様が提供する情報',
            items: [
              '<strong>アカウント情報:</strong> 登録時のお名前、メールアドレス、ユーザー名、パスワード。',
              '<strong>プロフィール情報:</strong> 任意で追加する自己紹介やアバター画像。',
              '<strong>コンテンツ:</strong> 投稿するプロンプト、説明、タグ、コメント、結果画像。',
              '<strong>連絡内容:</strong> サポートやフィードバックのために送信するメッセージ。',
            ],
          },
          {
            title: '1.2 自動収集情報',
            items: [
              '<strong>利用データ:</strong> 訪問ページ、閲覧プロンプト、実行アクション（いいね、ブックマーク、コピー）。',
              '<strong>デバイス情報:</strong> ブラウザの種類、OS、IPアドレス、参照URL。',
              '<strong>Cookie:</strong> 認証用セッションCookieおよび言語設定用の設定Cookie。',
            ],
          },
          {
            title: '1.3 サードパーティサインイン',
            text: 'Googleでサインインした場合、Googleからお名前、メールアドレス、プロフィール写真を受け取ります。Googleパスワードは受け取りません。',
          },
        ],
      },
      {
        title: '2. 情報の利用目的',
        items: [
          'PromptAllプラットフォームの提供、運営、維持',
          'アカウントの作成と管理',
          '他のユーザーへのプロンプトと公開プロフィールの表示',
          'サービス関連メールの送信（アカウント認証、パスワードリセット）',
          'サービス改善のための利用傾向の分析',
          '不正、不正利用、セキュリティインシデントの検出と防止',
          '法的義務の遵守',
        ],
        note: '当社は個人データを第三者に<strong>販売しません</strong>。',
      },
      {
        title: '3. Cookieとトラッキング',
        intro: '当社は以下の種類のCookieを使用しています:',
        cookies: [
          { type: '必須', purpose: '認証セッション', duration: 'セッション' },
          { type: '設定', purpose: '言語設定', duration: '1年' },
          { type: '分析', purpose: 'Google Analytics（匿名使用統計）', duration: '2年' },
        ],
        note: 'ブラウザの設定でCookieを無効にできます。必須Cookie無しでは一部機能が正しく動作しない場合があります。',
      },
      {
        title: '4. サードパーティサービス',
        intro: '当社は、独自のプライバシーポリシーに基づいてデータを処理する可能性のある以下のサードパーティサービスを利用しています:',
        services: [
          { name: 'Google Analytics', desc: '匿名利用分析', url: 'https://policies.google.com/privacy', label: 'Googleプライバシーポリシー' },
          { name: 'Google OAuth', desc: '任意のサインイン', url: 'https://policies.google.com/privacy', label: 'Googleプライバシーポリシー' },
          { name: 'Cloudinary', desc: '画像の保存と配信', url: 'https://cloudinary.com/privacy', label: 'Cloudinaryプライバシーポリシー' },
          { name: 'MongoDB Atlas', desc: 'データベースホスティング', url: 'https://www.mongodb.com/legal/privacy-policy', label: 'MongoDBプライバシーポリシー' },
          { name: 'Vercel', desc: 'ホスティングとデプロイ', url: 'https://vercel.com/legal/privacy-policy', label: 'Vercelプライバシーポリシー' },
          { name: 'Google AdSense', desc: '広告（有効な場合）', url: 'https://policies.google.com/privacy', label: 'Googleプライバシーポリシー' },
        ],
      },
      {
        title: '5. データ保持',
        items: [
          '<strong>アカウントデータ:</strong> アカウントが有効な間保持。削除要求後30日以内に削除。',
          '<strong>公開プロンプト:</strong> 削除またはアカウント削除要求まで保持。',
          '<strong>利用ログ:</strong> セキュリティとデバッグのため最大90日間保持。',
        ],
      },
      {
        title: '6. お客様の権利',
        intro: '居住地によって、以下の権利を有する場合があります:',
        items: [
          '<strong>アクセス権:</strong> 当社が保有する個人データのコピーを要求できます。',
          '<strong>修正権:</strong> 不正確または不完全なデータを修正できます。',
          '<strong>削除権:</strong> アカウントと関連データの削除を要求できます。',
          '<strong>データポータビリティ:</strong> 構造化された機械可読形式でデータを受け取れます。',
          '<strong>オプトアウト:</strong> いつでもマーケティングメールの受信を停止できます。',
        ],
        contact: 'これらの権利を行使するには、<strong>privacy@promptall.net</strong> までご連絡ください。',
      },
      {
        title: '7. 子どものプライバシー',
        text: 'PromptAllは13歳未満の方を対象としていません。13歳未満の子どもから意図的に個人情報を収集することはありません。13歳未満の子どもが個人データを提供したことが判明した場合、速やかに削除します。',
      },
      {
        title: '8. 国際データ転送',
        text: 'PromptAllはグローバルに運営されています。お客様のデータは、米国またはサービスプロバイダーが運営する他の国で保存・処理される場合があります。当社はこのような転送に適切な保護措置を講じています。',
      },
      {
        title: '9. ポリシーの変更',
        text: '本プライバシーポリシーは随時更新される場合があります。重要な変更がある場合は、このページに新しいポリシーを掲載し、「最終更新」日を更新してお知らせします。変更後もPromptAllを継続してご利用いただくことで、改訂されたポリシーに同意したものとみなされます。',
      },
      {
        title: '10. お問い合わせ',
        intro: '本プライバシーポリシーについてご質問やご懸念がある場合は、お問い合わせください:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    cookieHeaders: ['種類', '目的', '期間'],
    backHome: '← ホームへ',
    toTerms: '利用規約 →',
  },
  zh: {
    badge: '法律',
    title: '隐私政策',
    updated: '最后更新: 2026年2月24日',
    intro: '欢迎使用PromptAll（以下简称"我们"）。我们致力于保护您的个人信息和隐私权。本隐私政策说明了您访问promptall.net时我们如何收集、使用和保护您的信息。',
    sections: [
      {
        title: '1. 我们收集的信息',
        subsections: [
          {
            title: '1.1 您提供的信息',
            items: [
              '<strong>账户信息:</strong> 注册时的姓名、电子邮件地址、用户名和密码。',
              '<strong>个人资料:</strong> 您选择添加的简介或头像。',
              '<strong>内容:</strong> 您提交的提示词、描述、标签、评论和结果图片。',
              '<strong>通信:</strong> 您发送给我们的支持或反馈消息。',
            ],
          },
          {
            title: '1.2 自动收集的信息',
            items: [
              '<strong>使用数据:</strong> 访问的页面、查看的提示词、执行的操作（点赞、收藏、复制）。',
              '<strong>设备信息:</strong> 浏览器类型、操作系统、IP地址和来源URL。',
              '<strong>Cookie:</strong> 用于身份验证的会话Cookie和语言设置的偏好Cookie。',
            ],
          },
          {
            title: '1.3 第三方登录',
            text: '如果您使用Google登录，我们将从Google接收您的姓名、电子邮件地址和头像。我们不会收到您的Google密码。',
          },
        ],
      },
      {
        title: '2. 我们如何使用您的信息',
        items: [
          '提供、运营和维护PromptAll平台',
          '创建和管理您的账户',
          '向其他用户展示您的提示词和公开资料',
          '发送服务相关邮件（账户验证、密码重置）',
          '分析使用趋势以改进我们的服务',
          '检测和防止欺诈、滥用或安全事件',
          '履行法律义务',
        ],
        note: '我们<strong>不会</strong>将您的个人数据出售给第三方。',
      },
      {
        title: '3. Cookie和追踪',
        intro: '我们使用以下类型的Cookie:',
        cookies: [
          { type: '必要', purpose: '身份验证会话', duration: '会话' },
          { type: '偏好', purpose: '语言选择', duration: '1年' },
          { type: '分析', purpose: 'Google Analytics（匿名使用统计）', duration: '2年' },
        ],
        note: '您可以在浏览器设置中禁用Cookie。请注意，没有必要Cookie，某些功能可能无法正常工作。',
      },
      {
        title: '4. 第三方服务',
        intro: '我们使用以下可能根据其自身隐私政策处理您数据的第三方服务:',
        services: [
          { name: 'Google Analytics', desc: '匿名使用分析', url: 'https://policies.google.com/privacy', label: 'Google隐私政策' },
          { name: 'Google OAuth', desc: '可选登录', url: 'https://policies.google.com/privacy', label: 'Google隐私政策' },
          { name: 'Cloudinary', desc: '图片存储和传输', url: 'https://cloudinary.com/privacy', label: 'Cloudinary隐私政策' },
          { name: 'MongoDB Atlas', desc: '数据库托管', url: 'https://www.mongodb.com/legal/privacy-policy', label: 'MongoDB隐私政策' },
          { name: 'Vercel', desc: '托管和部署', url: 'https://vercel.com/legal/privacy-policy', label: 'Vercel隐私政策' },
          { name: 'Google AdSense', desc: '广告（启用时）', url: 'https://policies.google.com/privacy', label: 'Google隐私政策' },
        ],
      },
      {
        title: '5. 数据保留',
        items: [
          '<strong>账户数据:</strong> 账户有效期间保留。账户删除请求后30天内删除。',
          '<strong>公开提示词:</strong> 保留至您删除或请求账户删除。',
          '<strong>使用日志:</strong> 出于安全和调试目的保留最多90天。',
        ],
      },
      {
        title: '6. 您的权利',
        intro: '根据您所在的地区，您可能拥有以下权利:',
        items: [
          '<strong>访问权:</strong> 请求我们持有的个人数据副本。',
          '<strong>更正权:</strong> 更正不准确或不完整的数据。',
          '<strong>删除权:</strong> 请求删除您的账户和相关数据。',
          '<strong>可携带性:</strong> 以结构化、机器可读的格式接收您的数据。',
          '<strong>退出:</strong> 随时取消订阅营销邮件。',
        ],
        contact: '如需行使这些权利，请联系我们: <strong>privacy@promptall.net</strong>。',
      },
      {
        title: '7. 儿童隐私',
        text: 'PromptAll不面向13岁以下的人群。我们不会故意收集13岁以下儿童的个人信息。如果我们发现13岁以下的儿童提供了个人数据，我们将立即删除。',
      },
      {
        title: '8. 国际数据传输',
        text: 'PromptAll在全球范围内运营。您的数据可能在美国或我们服务提供商运营的其他国家存储和处理。我们确保对此类传输采取适当的保护措施。',
      },
      {
        title: '9. 政策变更',
        text: '我们可能会不时更新本隐私政策。如有重大变更，我们将在此页面发布新政策并更新"最后更新"日期。变更后继续使用PromptAll即表示接受修订后的政策。',
      },
      {
        title: '10. 联系我们',
        intro: '如果您对本隐私政策有任何疑问或顾虑，请联系我们:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    cookieHeaders: ['类型', '用途', '时长'],
    backHome: '← 返回首页',
    toTerms: '服务条款 →',
  },
  es: {
    badge: 'Legal',
    title: 'Política de Privacidad',
    updated: 'Última actualización: 24 de febrero de 2026',
    intro: 'Bienvenido a PromptAll ("nosotros"). Estamos comprometidos a proteger tu información personal y tu derecho a la privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos y protegemos tu información cuando visitas promptall.net.',
    sections: [
      {
        title: '1. Información que Recopilamos',
        subsections: [
          {
            title: '1.1 Información que Proporcionas',
            items: [
              '<strong>Información de cuenta:</strong> Nombre, correo electrónico, nombre de usuario y contraseña al registrarte.',
              '<strong>Información de perfil:</strong> Biografía o imagen de avatar que añades opcionalmente.',
              '<strong>Contenido:</strong> Prompts, descripciones, etiquetas, comentarios e imágenes de resultados.',
              '<strong>Comunicaciones:</strong> Mensajes que nos envías para soporte o comentarios.',
            ],
          },
          {
            title: '1.2 Información Recopilada Automáticamente',
            items: [
              '<strong>Datos de uso:</strong> Páginas visitadas, prompts vistos, acciones realizadas (likes, guardados, copias).',
              '<strong>Información del dispositivo:</strong> Tipo de navegador, sistema operativo, dirección IP y URLs de referencia.',
              '<strong>Cookies:</strong> Cookies de sesión para autenticación y cookies de preferencias para el idioma.',
            ],
          },
          {
            title: '1.3 Inicio de Sesión con Terceros',
            text: 'Si inicias sesión con Google, recibimos tu nombre, correo electrónico y foto de perfil de Google. No recibimos tu contraseña de Google.',
          },
        ],
      },
      {
        title: '2. Cómo Usamos tu Información',
        items: [
          'Proporcionar, operar y mantener la plataforma PromptAll',
          'Crear y gestionar tu cuenta',
          'Mostrar tus prompts y perfil público a otros usuarios',
          'Enviar correos electrónicos relacionados con el servicio (verificación de cuenta, restablecimiento de contraseña)',
          'Analizar tendencias de uso para mejorar nuestro servicio',
          'Detectar y prevenir fraudes, abusos o incidentes de seguridad',
          'Cumplir con obligaciones legales',
        ],
        note: '<strong>No</strong> vendemos tus datos personales a terceros.',
      },
      {
        title: '3. Cookies y Seguimiento',
        intro: 'Usamos los siguientes tipos de cookies:',
        cookies: [
          { type: 'Esenciales', purpose: 'Sesión de autenticación', duration: 'Sesión' },
          { type: 'Preferencias', purpose: 'Selección de idioma', duration: '1 año' },
          { type: 'Analíticas', purpose: 'Google Analytics (estadísticas anónimas)', duration: '2 años' },
        ],
        note: 'Puedes desactivar las cookies en la configuración de tu navegador. Ten en cuenta que algunas funciones pueden no funcionar correctamente sin las cookies esenciales.',
      },
      {
        title: '4. Servicios de Terceros',
        intro: 'Usamos los siguientes servicios de terceros que pueden procesar tus datos bajo sus propias políticas de privacidad:',
        services: [
          { name: 'Google Analytics', desc: 'Análisis de uso anónimo', url: 'https://policies.google.com/privacy', label: 'Política de Privacidad de Google' },
          { name: 'Google OAuth', desc: 'Inicio de sesión opcional', url: 'https://policies.google.com/privacy', label: 'Política de Privacidad de Google' },
          { name: 'Cloudinary', desc: 'Almacenamiento y entrega de imágenes', url: 'https://cloudinary.com/privacy', label: 'Política de Privacidad de Cloudinary' },
          { name: 'MongoDB Atlas', desc: 'Alojamiento de base de datos', url: 'https://www.mongodb.com/legal/privacy-policy', label: 'Política de Privacidad de MongoDB' },
          { name: 'Vercel', desc: 'Alojamiento y despliegue', url: 'https://vercel.com/legal/privacy-policy', label: 'Política de Privacidad de Vercel' },
          { name: 'Google AdSense', desc: 'Publicidad (cuando está habilitada)', url: 'https://policies.google.com/privacy', label: 'Política de Privacidad de Google' },
        ],
      },
      {
        title: '5. Retención de Datos',
        items: [
          '<strong>Datos de cuenta:</strong> Retenidos mientras tu cuenta esté activa. Eliminados dentro de los 30 días posteriores a la solicitud de eliminación.',
          '<strong>Prompts públicos:</strong> Retenidos hasta que los elimines o solicites la eliminación de la cuenta.',
          '<strong>Registros de uso:</strong> Retenidos hasta 90 días por razones de seguridad y depuración.',
        ],
      },
      {
        title: '6. Tus Derechos',
        intro: 'Dependiendo de tu ubicación, puedes tener los siguientes derechos:',
        items: [
          '<strong>Acceso:</strong> Solicitar una copia de los datos personales que tenemos sobre ti.',
          '<strong>Rectificación:</strong> Corregir datos inexactos o incompletos.',
          '<strong>Eliminación:</strong> Solicitar la eliminación de tu cuenta y datos asociados.',
          '<strong>Portabilidad:</strong> Recibir tus datos en un formato estructurado y legible por máquina.',
          '<strong>Exclusión:</strong> Darte de baja de correos de marketing en cualquier momento.',
        ],
        contact: 'Para ejercer estos derechos, contáctanos en <strong>privacy@promptall.net</strong>.',
      },
      {
        title: '7. Privacidad de los Niños',
        text: 'PromptAll no está dirigido a personas menores de 13 años. No recopilamos intencionalmente información personal de menores de 13 años. Si tomamos conocimiento de que un menor de 13 años ha proporcionado datos personales, los eliminaremos de inmediato.',
      },
      {
        title: '8. Transferencias Internacionales de Datos',
        text: 'PromptAll opera globalmente. Tus datos pueden ser almacenados y procesados en los Estados Unidos u otros países donde operan nuestros proveedores de servicios. Garantizamos que existen las salvaguardas adecuadas para dichas transferencias.',
      },
      {
        title: '9. Cambios a Esta Política',
        text: 'Podemos actualizar esta Política de Privacidad de vez en cuando. Te notificaremos de cambios importantes publicando la nueva política en esta página y actualizando la fecha de "Última actualización". El uso continuo de PromptAll después de los cambios constituye la aceptación de la política revisada.',
      },
      {
        title: '10. Contáctanos',
        intro: 'Si tienes preguntas o inquietudes sobre esta Política de Privacidad, contáctanos:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    cookieHeaders: ['Tipo', 'Propósito', 'Duración'],
    backHome: '← Volver al inicio',
    toTerms: 'Términos de servicio →',
  },
  fr: {
    badge: 'Légal',
    title: 'Politique de Confidentialité',
    updated: 'Dernière mise à jour : 24 février 2026',
    intro: 'Bienvenue sur PromptAll (« nous »). Nous nous engageons à protéger vos informations personnelles et votre droit à la vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons et protégeons vos informations lorsque vous visitez promptall.net.',
    sections: [
      {
        title: '1. Informations Collectées',
        subsections: [
          {
            title: '1.1 Informations que vous fournissez',
            items: [
              '<strong>Informations de compte :</strong> Nom, adresse e-mail, nom d\'utilisateur et mot de passe lors de l\'inscription.',
              '<strong>Informations de profil :</strong> Biographie ou image d\'avatar ajoutées optionnellement.',
              '<strong>Contenu :</strong> Prompts, descriptions, tags, commentaires et images de résultats soumis.',
              '<strong>Communications :</strong> Messages envoyés pour le support ou les commentaires.',
            ],
          },
          {
            title: '1.2 Informations collectées automatiquement',
            items: [
              '<strong>Données d\'utilisation :</strong> Pages visitées, prompts consultés, actions effectuées (likes, sauvegardes, copies).',
              '<strong>Informations sur l\'appareil :</strong> Type de navigateur, système d\'exploitation, adresse IP et URLs de référence.',
              '<strong>Cookies :</strong> Cookies de session pour l\'authentification et cookies de préférences pour la langue.',
            ],
          },
          {
            title: '1.3 Connexion via des tiers',
            text: 'Si vous vous connectez avec Google, nous recevons votre nom, adresse e-mail et photo de profil de Google. Nous ne recevons pas votre mot de passe Google.',
          },
        ],
      },
      {
        title: '2. Utilisation de vos informations',
        items: [
          'Fournir, exploiter et maintenir la plateforme PromptAll',
          'Créer et gérer votre compte',
          'Afficher vos prompts et votre profil public aux autres utilisateurs',
          'Envoyer des e-mails liés au service (vérification de compte, réinitialisation de mot de passe)',
          'Analyser les tendances d\'utilisation pour améliorer notre service',
          'Détecter et prévenir les fraudes, abus ou incidents de sécurité',
          'Respecter les obligations légales',
        ],
        note: 'Nous ne <strong>vendons pas</strong> vos données personnelles à des tiers.',
      },
      {
        title: '3. Cookies et suivi',
        intro: 'Nous utilisons les types de cookies suivants :',
        cookies: [
          { type: 'Essentiels', purpose: 'Session d\'authentification', duration: 'Session' },
          { type: 'Préférences', purpose: 'Sélection de la langue', duration: '1 an' },
          { type: 'Analytiques', purpose: 'Google Analytics (statistiques anonymes)', duration: '2 ans' },
        ],
        note: 'Vous pouvez désactiver les cookies dans les paramètres de votre navigateur. Notez que certaines fonctionnalités peuvent ne pas fonctionner correctement sans les cookies essentiels.',
      },
      {
        title: '4. Services tiers',
        intro: 'Nous utilisons les services tiers suivants qui peuvent traiter vos données selon leurs propres politiques de confidentialité :',
        services: [
          { name: 'Google Analytics', desc: 'Analyse d\'utilisation anonyme', url: 'https://policies.google.com/privacy', label: 'Politique de confidentialité Google' },
          { name: 'Google OAuth', desc: 'Connexion optionnelle', url: 'https://policies.google.com/privacy', label: 'Politique de confidentialité Google' },
          { name: 'Cloudinary', desc: 'Stockage et diffusion d\'images', url: 'https://cloudinary.com/privacy', label: 'Politique de confidentialité Cloudinary' },
          { name: 'MongoDB Atlas', desc: 'Hébergement de base de données', url: 'https://www.mongodb.com/legal/privacy-policy', label: 'Politique de confidentialité MongoDB' },
          { name: 'Vercel', desc: 'Hébergement et déploiement', url: 'https://vercel.com/legal/privacy-policy', label: 'Politique de confidentialité Vercel' },
          { name: 'Google AdSense', desc: 'Publicité (si activée)', url: 'https://policies.google.com/privacy', label: 'Politique de confidentialité Google' },
        ],
      },
      {
        title: '5. Conservation des données',
        items: [
          '<strong>Données de compte :</strong> Conservées pendant l\'activité du compte. Supprimées dans les 30 jours suivant la demande de suppression.',
          '<strong>Prompts publics :</strong> Conservés jusqu\'à leur suppression ou la suppression du compte.',
          '<strong>Journaux d\'utilisation :</strong> Conservés jusqu\'à 90 jours à des fins de sécurité et de débogage.',
        ],
      },
      {
        title: '6. Vos droits',
        intro: 'Selon votre lieu de résidence, vous pouvez avoir les droits suivants :',
        items: [
          '<strong>Accès :</strong> Demander une copie des données personnelles que nous détenons sur vous.',
          '<strong>Rectification :</strong> Corriger des données inexactes ou incomplètes.',
          '<strong>Effacement :</strong> Demander la suppression de votre compte et des données associées.',
          '<strong>Portabilité :</strong> Recevoir vos données dans un format structuré et lisible par machine.',
          '<strong>Opposition :</strong> Vous désabonner des e-mails marketing à tout moment.',
        ],
        contact: 'Pour exercer ces droits, contactez-nous à <strong>privacy@promptall.net</strong>.',
      },
      {
        title: '7. Confidentialité des enfants',
        text: 'PromptAll n\'est pas destiné aux personnes de moins de 13 ans. Nous ne collectons pas sciemment des informations personnelles d\'enfants de moins de 13 ans. Si nous apprenons qu\'un enfant de moins de 13 ans a fourni des données personnelles, nous les supprimerons rapidement.',
      },
      {
        title: '8. Transferts internationaux de données',
        text: 'PromptAll opère à l\'échelle mondiale. Vos données peuvent être stockées et traitées aux États-Unis ou dans d\'autres pays où nos prestataires de services opèrent. Nous veillons à ce que des garanties appropriées soient en place pour ces transferts.',
      },
      {
        title: '9. Modifications de cette politique',
        text: 'Nous pouvons mettre à jour cette Politique de Confidentialité de temps à autre. Nous vous informerons des changements importants en publiant la nouvelle politique sur cette page et en mettant à jour la date de « Dernière mise à jour ». L\'utilisation continue de PromptAll après les changements constitue l\'acceptation de la politique révisée.',
      },
      {
        title: '10. Nous contacter',
        intro: 'Si vous avez des questions ou des préoccupations concernant cette Politique de Confidentialité, veuillez nous contacter :',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    cookieHeaders: ['Type', 'Objectif', 'Durée'],
    backHome: '← Retour à l\'accueil',
    toTerms: 'Conditions d\'utilisation →',
  },
};

type ContentKey = keyof typeof CONTENT;
type SectionType = typeof CONTENT.en.sections[number];
type SubsectionType = { title: string; items?: string[]; text?: string };

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const content = CONTENT[(locale as ContentKey)] ?? CONTENT.en;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">{content.badge}</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">{content.title}</h1>
          <p className="text-slate-400">{content.updated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-slate max-w-none">

          {/* Intro */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-10 text-slate-700 text-sm leading-relaxed">
            {content.intro}
          </div>

          {content.sections.map((section: any) => (
            <div key={section.title} className="mb-10">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{section.title}</h2>
              <div className="text-slate-600 leading-relaxed space-y-3 text-[15px]">

                {/* Intro text for section */}
                {section.intro && <p>{section.intro}</p>}

                {/* Subsections (e.g., section 1) */}
                {section.subsections?.map((sub: SubsectionType) => (
                  <div key={sub.title} className="mb-4">
                    <h3 className="font-semibold text-slate-800 mb-2">{sub.title}</h3>
                    <div className="text-slate-600 space-y-2">
                      {sub.items && (
                        <ul className="list-disc pl-5 space-y-1">
                          {sub.items.map((item: string, i: number) => (
                            <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                          ))}
                        </ul>
                      )}
                      {sub.text && <p>{sub.text}</p>}
                    </div>
                  </div>
                ))}

                {/* Direct items list */}
                {section.items && (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.items.map((item: string, i: number) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                    ))}
                  </ul>
                )}

                {/* Note */}
                {section.note && <p dangerouslySetInnerHTML={{ __html: section.note }} />}

                {/* Cookie table */}
                {section.cookies && (
                  <>
                    <table className="w-full text-sm border-collapse mt-4">
                      <thead>
                        <tr className="bg-slate-100">
                          {content.cookieHeaders.map((h: string) => (
                            <th key={h} className="text-left px-4 py-2 font-semibold text-slate-700">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.cookies.map((cookie: any, i: number) => (
                          <tr key={i} className="border-b border-slate-100">
                            <td className="px-4 py-2.5 text-slate-600">{cookie.type}</td>
                            <td className="px-4 py-2.5 text-slate-600">{cookie.purpose}</td>
                            <td className="px-4 py-2.5 text-slate-600">{cookie.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <p className="mt-4 text-sm text-slate-500">{section.note}</p>
                  </>
                )}

                {/* Services list */}
                {section.services && (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.services.map((svc: any) => (
                      <li key={svc.name}>
                        <strong>{svc.name}:</strong> {svc.desc} —{' '}
                        <a href={svc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{svc.label}</a>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Plain text */}
                {section.text && <p>{section.text}</p>}

                {/* Contact line */}
                {section.contact && <p dangerouslySetInnerHTML={{ __html: section.contact }} />}

                {/* Contact block */}
                {section.contactBlock && (
                  <div className="bg-slate-50 rounded-xl p-5 mt-3 text-sm text-slate-700 space-y-1">
                    <p><strong>{section.contactBlock.name}</strong></p>
                    <p>Email: <a href={`mailto:${section.contactBlock.email}`} className="text-indigo-600 hover:underline">{section.contactBlock.email}</a></p>
                    <p>Website: <a href={`https://${section.contactBlock.site}`} className="text-indigo-600 hover:underline">{section.contactBlock.site}</a></p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
          <Link href={`/${locale}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">{content.backHome}</Link>
          <Link href={`/${locale}/terms`} className="text-sm text-slate-500 hover:text-slate-700">{content.toTerms}</Link>
        </div>
      </div>
    </div>
  );
}
