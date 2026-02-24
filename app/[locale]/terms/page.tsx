import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | PromptAll',
  description: 'Read the Terms of Service for using the PromptAll platform.',
};

const CONTENT = {
  en: {
    badge: 'Legal',
    title: 'Terms of Service',
    updated: 'Last updated: February 24, 2026',
    intro: 'Please read these Terms of Service carefully before using PromptAll (promptall.net). By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.',
    sections: [
      { title: '1. Acceptance of Terms', text: 'By creating an account or using PromptAll in any way, you confirm that you are at least 13 years old and that you agree to these Terms of Service and our Privacy Policy. If you are using PromptAll on behalf of an organization, you represent that you have authority to bind that organization to these terms.' },
      {
        title: '2. Description of Service',
        intro: 'PromptAll is a community platform for sharing, discovering, and exploring AI prompts. The service includes:',
        items: ['Browsing and searching a library of AI prompts', 'Submitting and publishing your own prompts', 'Interacting with prompts via likes, comments, and bookmarks', 'Creating a public profile as an AI prompt creator', 'Multi-language support for global accessibility'],
        note: 'We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.',
      },
      {
        title: '3. User Accounts',
        subsections: [
          { title: '3.1 Registration', text: 'You may register using email/password or Google Sign-In. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.' },
          { title: '3.2 Account Accuracy', text: 'You agree to provide accurate, current, and complete information. You must promptly update your account information to keep it accurate.' },
          { title: '3.3 Account Security', text: 'Notify us immediately at privacy@promptall.net if you suspect unauthorized access to your account. We are not liable for losses resulting from unauthorized use of your credentials.' },
        ],
      },
      {
        title: '4. User Content',
        subsections: [
          { title: '4.1 Your Content', text: 'You retain ownership of prompts, descriptions, images, and other content you submit ("User Content"). By submitting content, you grant PromptAll a worldwide, non-exclusive, royalty-free license to display, distribute, and promote your content on the platform.' },
          {
            title: '4.2 Content Standards',
            intro: 'You agree that your content will not:',
            items: ['Violate any applicable law or regulation', 'Infringe intellectual property rights of any third party', 'Contain harmful, abusive, threatening, obscene, or defamatory material', 'Include personal information of others without their consent', 'Promote illegal activities or self-harm', 'Contain malware, spam, or deceptive content'],
          },
          { title: '4.3 Content Removal', text: 'We reserve the right to remove any content that violates these terms or that we deem harmful to the community, without prior notice.' },
        ],
      },
      {
        title: '5. Prohibited Conduct',
        intro: 'You may not:',
        items: ['Use the service for any unlawful purpose', 'Attempt to gain unauthorized access to any part of the service or other users\' accounts', 'Use automated tools to scrape, crawl, or bulk-download content without permission', 'Impersonate any person or entity', 'Interfere with or disrupt the integrity or performance of the service', 'Circumvent any access controls or usage limitations', 'Use the platform to send unsolicited commercial messages'],
      },
      {
        title: '6. Intellectual Property',
        subsections: [
          { title: '6.1 Platform Content', text: 'The PromptAll platform, including its design, logos, and original content created by us, is protected by copyright and other intellectual property laws. You may not reproduce, modify, or distribute our platform content without written permission.' },
          { title: '6.2 Feedback', text: 'If you provide feedback, suggestions, or ideas about the service, you grant us the right to use such feedback without any obligation to compensate you.' },
        ],
      },
      { title: '7. Third-Party Services', text: 'PromptAll integrates with third-party services including Google (OAuth, Analytics, AdSense), Cloudinary, MongoDB Atlas, and Vercel. Your use of these services is subject to their respective terms and privacy policies. We are not responsible for the practices or content of third-party services.' },
      { title: '8. Advertising', text: 'PromptAll may display advertisements served by Google AdSense and other ad networks. Advertisements are clearly distinguished from user content. We are not responsible for the content of third-party advertisements.' },
      {
        title: '9. Disclaimer of Warranties',
        intro: 'PromptAll is provided "as is" and "as available" without warranties of any kind. We do not warrant that:',
        items: ['The service will be uninterrupted, error-free, or secure', 'Any prompts will produce specific AI outputs or results', 'Content on the platform is accurate, complete, or reliable'],
        note: 'Your use of the service is at your own risk.',
      },
      { title: '10. Limitation of Liability', text: 'To the maximum extent permitted by law, PromptAll shall not be liable for any indirect, incidental, special, consequential, or punitive damages. Our total liability shall not exceed the greater of $100 USD or the amount you paid us in the past 12 months.' },
      { title: '11. Indemnification', text: 'You agree to indemnify and hold harmless PromptAll from any claims, damages, liabilities, and expenses (including legal fees) arising from your use of the service, your User Content, or your violation of these terms.' },
      { title: '12. Termination', text: 'We may suspend or terminate your account at any time for conduct that violates these terms. You may delete your account by contacting privacy@promptall.net. Upon termination, your right to use the service will immediately cease.' },
      { title: '13. Governing Law', text: 'These terms shall be governed by applicable law. Disputes shall be resolved through good-faith negotiation, and if that fails, through binding arbitration or a court of competent jurisdiction.' },
      { title: '14. Changes to Terms', text: 'We may update these Terms of Service from time to time. We will notify you by posting the updated terms on this page and updating the "Last updated" date. Continued use constitutes acceptance of the revised terms.' },
      {
        title: '15. Contact Us',
        intro: 'If you have questions about these Terms of Service, please contact us:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    backHome: '← Back to Home',
    toPrivacy: '← Privacy Policy',
  },
  ko: {
    badge: '법적 고지',
    title: '이용약관',
    updated: '최종 업데이트: 2026년 2월 24일',
    intro: 'PromptAll(promptall.net)을 사용하기 전에 이 이용약관을 주의 깊게 읽어주세요. 플랫폼에 접근하거나 사용함으로써 이 약관에 동의하게 됩니다. 약관에 동의하지 않으시면 서비스를 이용하실 수 없습니다.',
    sections: [
      { title: '1. 약관 동의', text: '계정을 생성하거나 PromptAll을 어떤 방식으로든 이용함으로써, 귀하는 만 13세 이상임을 확인하고 이 이용약관 및 개인정보처리방침에 동의합니다. 조직을 대신하여 이용하는 경우, 해당 조직을 약관에 구속할 권한이 있음을 나타냅니다.' },
      {
        title: '2. 서비스 설명',
        intro: 'PromptAll은 AI 프롬프트를 공유, 발견, 탐색하는 커뮤니티 플랫폼입니다. 서비스에는 다음이 포함됩니다:',
        items: ['AI 프롬프트 라이브러리 탐색 및 검색', '나만의 프롬프트 제출 및 게시', '좋아요, 댓글, 북마크를 통한 프롬프트 상호작용', 'AI 프롬프트 크리에이터로서 공개 프로필 생성', '글로벌 접근을 위한 다국어 지원'],
        note: '당사는 서비스의 어떤 측면이든 언제든지 수정, 중단 또는 종료할 권리를 보유합니다.',
      },
      {
        title: '3. 사용자 계정',
        subsections: [
          { title: '3.1 가입', text: '이메일/비밀번호 또는 Google 로그인으로 가입할 수 있습니다. 귀하는 계정 자격 증명의 기밀 유지 및 계정에서 발생하는 모든 활동에 책임이 있습니다.' },
          { title: '3.2 정보 정확성', text: '정확하고 최신의 완전한 정보를 제공하는 데 동의합니다. 계정 정보를 최신 상태로 유지하기 위해 신속하게 업데이트해야 합니다.' },
          { title: '3.3 계정 보안', text: '계정에 무단 접근이 의심되면 즉시 privacy@promptall.net으로 알려주세요. 자격 증명의 무단 사용으로 인한 손실에 대해 당사는 책임지지 않습니다.' },
        ],
      },
      {
        title: '4. 사용자 콘텐츠',
        subsections: [
          { title: '4.1 귀하의 콘텐츠', text: '귀하가 제출한 프롬프트, 설명, 이미지 등의 콘텐츠("사용자 콘텐츠")에 대한 소유권은 귀하에게 있습니다. 콘텐츠를 제출함으로써, 플랫폼에서 콘텐츠를 표시, 배포, 홍보할 수 있는 전 세계적, 비독점적, 로열티 무료 라이선스를 PromptAll에 부여합니다.' },
          {
            title: '4.2 콘텐츠 기준',
            intro: '귀하의 콘텐츠가 다음에 해당하지 않아야 합니다:',
            items: ['관련 법률 또는 규정 위반', '제3자의 지적 재산권 침해', '유해하거나 모욕적이거나 위협적이거나 외설적이거나 명예훼손적인 내용', '동의 없이 타인의 개인 정보 포함', '불법 활동 또는 자해 조장', '악성 소프트웨어, 스팸 또는 기만적 콘텐츠'],
          },
          { title: '4.3 콘텐츠 삭제', text: '당사는 이 약관을 위반하거나 커뮤니티에 해롭다고 판단되는 콘텐츠를 사전 통지 없이 삭제할 권리를 보유합니다.' },
        ],
      },
      {
        title: '5. 금지 행위',
        intro: '귀하는 다음 행위를 해서는 안 됩니다:',
        items: ['서비스를 불법적인 목적으로 사용', '서비스의 일부 또는 다른 사용자의 계정에 무단으로 접근 시도', '자동화 도구를 사용하여 허가 없이 콘텐츠를 스크래핑, 크롤링 또는 대량 다운로드', '다른 사람이나 단체를 사칭', '서비스의 무결성 또는 성능 방해', '접근 제어 또는 사용 제한 우회', '플랫폼을 사용하여 원치 않는 상업적 메시지 발송'],
      },
      {
        title: '6. 지적 재산권',
        subsections: [
          { title: '6.1 플랫폼 콘텐츠', text: 'PromptAll 플랫폼(디자인, 로고, 당사가 생성한 오리지널 콘텐츠 포함)은 저작권 및 기타 지적 재산권 법률의 보호를 받습니다. 서면 허가 없이 당사 플랫폼 콘텐츠를 복제, 수정 또는 배포할 수 없습니다.' },
          { title: '6.2 피드백', text: '서비스에 대한 피드백, 제안 또는 아이디어를 제공하는 경우, 보상 의무 없이 해당 피드백을 사용할 수 있는 권리를 당사에 부여합니다.' },
        ],
      },
      { title: '7. 제3자 서비스', text: 'PromptAll은 Google(OAuth, Analytics, AdSense), Cloudinary, MongoDB Atlas, Vercel을 포함한 제3자 서비스와 통합됩니다. 이러한 서비스 이용은 각각의 약관 및 개인정보처리방침의 적용을 받습니다. 당사는 제3자 서비스의 관행이나 콘텐츠에 대해 책임지지 않습니다.' },
      { title: '8. 광고', text: 'PromptAll은 Google AdSense 및 기타 광고 네트워크의 광고를 표시할 수 있습니다. 광고는 사용자 콘텐츠와 명확히 구별됩니다. 당사는 제3자 광고의 콘텐츠에 대해 책임지지 않습니다.' },
      {
        title: '9. 보증 부인',
        intro: 'PromptAll은 어떠한 보증도 없이 "있는 그대로" 제공됩니다. 당사는 다음을 보장하지 않습니다:',
        items: ['서비스가 중단 없이, 오류 없이, 또는 안전하게 제공될 것', '프롬프트가 특정 AI 결과물을 생성할 것', '플랫폼의 콘텐츠가 정확하거나 완전하거나 신뢰할 수 있을 것'],
        note: '서비스 이용은 귀하 본인의 위험 부담으로 합니다.',
      },
      { title: '10. 책임 제한', text: '관련 법률이 허용하는 최대 범위 내에서, PromptAll은 어떠한 간접적, 부수적, 특별, 결과적 또는 징벌적 손해에 대해 책임지지 않습니다. 당사의 총 책임은 $100 USD 또는 지난 12개월 동안 귀하가 지불한 금액 중 더 큰 금액을 초과하지 않습니다.' },
      { title: '11. 면책', text: '귀하는 서비스 이용, 사용자 콘텐츠 또는 본 약관 위반으로 인해 발생하는 모든 청구, 손해, 책임 및 비용(법적 수수료 포함)으로부터 PromptAll을 면책시키고 보호하는 데 동의합니다.' },
      { title: '12. 계약 종료', text: '당사는 본 약관을 위반하는 행위에 대해 언제든지 계정을 정지 또는 종료할 수 있습니다. privacy@promptall.net으로 연락하여 계정을 삭제할 수 있습니다. 종료 시 서비스 이용 권한이 즉시 소멸됩니다.' },
      { title: '13. 준거법', text: '이 약관은 관련 법률에 의해 규율됩니다. 분쟁은 성실한 협상을 통해 해결되며, 실패할 경우 구속력 있는 중재 또는 관할 법원에 제출됩니다.' },
      { title: '14. 약관 변경', text: '당사는 이 이용약관을 수시로 업데이트할 수 있습니다. 이 페이지에 업데이트된 약관을 게시하고 "최종 업데이트" 날짜를 변경하여 알려드립니다. 변경 후 계속 이용하면 개정된 약관에 동의하는 것으로 간주됩니다.' },
      {
        title: '15. 문의하기',
        intro: '이 이용약관에 대한 질문이 있으시면 문의해 주세요:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    backHome: '← 홈으로',
    toPrivacy: '← 개인정보처리방침',
  },
  ja: {
    badge: '法的情報',
    title: '利用規約',
    updated: '最終更新: 2026年2月24日',
    intro: 'PromptAll（promptall.net）をご利用になる前に、この利用規約をよくお読みください。プラットフォームにアクセスまたは使用することで、これらの規約に同意したものとみなされます。',
    sections: [
      { title: '1. 規約への同意', text: 'アカウントを作成したり、PromptAllを利用したりすることで、13歳以上であることを確認し、本利用規約およびプライバシーポリシーに同意したものとみなされます。' },
      {
        title: '2. サービスの説明',
        intro: 'PromptAllはAIプロンプトの共有・発見・探索のためのコミュニティプラットフォームです。サービスには以下が含まれます:',
        items: ['AIプロンプトライブラリの閲覧と検索', '独自のプロンプトの投稿と公開', 'いいね・コメント・ブックマークによるプロンプトとのインタラクション', 'AIプロンプトクリエイターとしての公開プロフィール作成', 'グローバルアクセスのための多言語サポート'],
        note: '当社はいつでもサービスの任意の側面を変更、停止、または終了する権利を留保します。',
      },
      {
        title: '3. ユーザーアカウント',
        subsections: [
          { title: '3.1 登録', text: 'メール/パスワードまたはGoogle Sign-Inで登録できます。アカウントの認証情報の機密性維持と、アカウントで発生するすべての活動に責任を負います。' },
          { title: '3.2 情報の正確性', text: '正確で最新の完全な情報を提供することに同意します。アカウント情報を最新の状態に保つよう速やかに更新してください。' },
          { title: '3.3 アカウントセキュリティ', text: 'アカウントへの不正アクセスが疑われる場合は、privacy@promptall.netに直ちにご連絡ください。認証情報の不正使用による損失について当社は責任を負いません。' },
        ],
      },
      {
        title: '4. ユーザーコンテンツ',
        subsections: [
          { title: '4.1 お客様のコンテンツ', text: '投稿したプロンプト、説明、画像等のコンテンツ（「ユーザーコンテンツ」）の所有権はお客様に帰属します。コンテンツを投稿することで、プラットフォームでコンテンツを表示・配布・宣伝するための、全世界的な非独占的・ロイヤルティフリーのライセンスをPromptAllに付与します。' },
          {
            title: '4.2 コンテンツ基準',
            intro: 'コンテンツが以下に該当しないことに同意します:',
            items: ['適用される法律または規制の違反', '第三者の知的財産権の侵害', '有害、虐待的、脅迫的、わいせつ、または名誉毀損的な内容', '同意なしに他者の個人情報を含める', '違法行為または自傷行為の促進', 'マルウェア、スパム、または欺瞞的なコンテンツ'],
          },
          { title: '4.3 コンテンツの削除', text: '当社は、本規約に違反するコンテンツまたはコミュニティに有害と判断するコンテンツを、事前通知なく削除する権利を留保します。' },
        ],
      },
      {
        title: '5. 禁止事項',
        intro: '以下の行為を行ってはなりません:',
        items: ['サービスを違法な目的に使用すること', 'サービスの一部または他のユーザーのアカウントへの不正アクセスの試み', '許可なくコンテンツをスクレイピング・クロール・大量ダウンロードする自動ツールの使用', '他の人や組織を詐称すること', 'サービスの整合性またはパフォーマンスの妨害', 'アクセス制御や使用制限の回避', '迷惑な商業メッセージの送信にプラットフォームを使用すること'],
      },
      {
        title: '6. 知的財産権',
        subsections: [
          { title: '6.1 プラットフォームコンテンツ', text: 'PromptAllプラットフォーム（デザイン、ロゴ、当社が作成したオリジナルコンテンツを含む）は著作権およびその他の知的財産権法で保護されています。書面による許可なく、当社のプラットフォームコンテンツを複製、修正、または配布することはできません。' },
          { title: '6.2 フィードバック', text: 'サービスに関するフィードバック、提案、アイデアを提供する場合、補償義務なしにそのフィードバックを使用する権利を当社に付与します。' },
        ],
      },
      { title: '7. サードパーティサービス', text: 'PromptAllはGoogle（OAuth、Analytics、AdSense）、Cloudinary、MongoDB Atlas、Vercelなどのサードパーティサービスと統合されています。これらのサービスのご利用は、それぞれの利用規約およびプライバシーポリシーに準拠します。' },
      { title: '8. 広告', text: 'PromptAllはGoogle AdSenseおよびその他の広告ネットワークからの広告を表示する場合があります。広告はユーザーコンテンツと明確に区別されます。' },
      {
        title: '9. 保証の免責',
        intro: 'PromptAllは「現状のまま」「利用可能な状態で」いかなる保証もなく提供されます。当社は以下を保証しません:',
        items: ['サービスが中断なく、エラーなく、または安全に提供されること', 'プロンプトが特定のAI出力や結果を生成すること', 'プラットフォームのコンテンツが正確、完全、または信頼できること'],
        note: 'サービスの利用はお客様自身の責任で行ってください。',
      },
      { title: '10. 責任の制限', text: '適用法で許容される最大限の範囲で、PromptAllはいかなる間接的、付随的、特別、結果的、または懲罰的損害について責任を負いません。当社の総責任は$100 USDまたは過去12ヶ月間にお支払いいただいた金額のいずれか大きい方を超えないものとします。' },
      { title: '11. 補償', text: 'サービスの利用、ユーザーコンテンツ、または本規約の違反から生じるすべての請求、損害、費用（法的費用を含む）からPromptAllを免責し、補償することに同意します。' },
      { title: '12. 解約', text: '当社は、本規約に違反する行為について、いつでもアカウントを停止または終了する場合があります。privacy@promptall.netにご連絡いただくことでアカウントを削除できます。' },
      { title: '13. 準拠法', text: '本規約は適用法に準拠します。紛争は誠意ある交渉を通じて解決され、失敗した場合は拘束力のある仲裁または管轄裁判所に付託されます。' },
      { title: '14. 規約の変更', text: '当社は本利用規約を随時更新する場合があります。このページに更新された規約を掲載し、「最終更新」日を更新してお知らせします。変更後も継続してご利用いただくことで、改訂された規約に同意したものとみなされます。' },
      {
        title: '15. お問い合わせ',
        intro: '本利用規約についてご質問がある場合は、お問い合わせください:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    backHome: '← ホームへ',
    toPrivacy: '← プライバシーポリシー',
  },
  zh: {
    badge: '法律',
    title: '服务条款',
    updated: '最后更新: 2026年2月24日',
    intro: '在使用PromptAll（promptall.net）之前，请仔细阅读本服务条款。访问或使用我们的平台即表示您同意这些条款。如果您不同意这些条款的任何部分，您将无法使用该服务。',
    sections: [
      { title: '1. 条款接受', text: '通过创建账户或以任何方式使用PromptAll，您确认您已年满13岁，并同意本服务条款和隐私政策。' },
      {
        title: '2. 服务说明',
        intro: 'PromptAll是一个用于分享、发现和探索AI提示词的社区平台。服务包括：',
        items: ['浏览和搜索AI提示词库', '提交和发布您自己的提示词', '通过点赞、评论和收藏与提示词互动', '作为AI提示词创作者创建公开主页', '支持全球访问的多语言支持'],
        note: '我们保留随时修改、暂停或终止服务任何方面的权利。',
      },
      {
        title: '3. 用户账户',
        subsections: [
          { title: '3.1 注册', text: '您可以使用邮箱/密码或Google登录进行注册。您有责任维护账户凭据的保密性，并对账户下发生的所有活动负责。' },
          { title: '3.2 信息准确性', text: '您同意提供准确、最新和完整的信息，并及时更新账户信息以保持准确。' },
          { title: '3.3 账户安全', text: '如果您怀疑账户被未授权访问，请立即通过privacy@promptall.net通知我们。对于因未授权使用您的凭据而导致的损失，我们不承担责任。' },
        ],
      },
      {
        title: '4. 用户内容',
        subsections: [
          { title: '4.1 您的内容', text: '您保留对所提交的提示词、描述、图片等内容（"用户内容"）的所有权。通过提交内容，您授予PromptAll在平台上展示、分发和推广您内容的全球性、非独占性、免版税许可证。' },
          {
            title: '4.2 内容标准',
            intro: '您的内容不得：',
            items: ['违反任何适用法律或法规', '侵犯任何第三方的知识产权', '包含有害、辱骂、威胁、淫秽或诽谤性内容', '未经同意包含他人个人信息', '宣扬非法活动或自我伤害', '包含恶意软件、垃圾信息或欺骗性内容'],
          },
          { title: '4.3 内容删除', text: '我们保留删除任何违反这些条款或我们认为对社区有害的内容的权利，无需事先通知。' },
        ],
      },
      {
        title: '5. 禁止行为',
        intro: '您不得：',
        items: ['将服务用于任何非法目的', '试图未经授权访问服务的任何部分或其他用户的账户', '使用自动化工具未经许可抓取、爬取或批量下载内容', '冒充任何人或实体', '干扰或破坏服务的完整性或性能', '绕过任何访问控制或使用限制', '使用平台发送未经请求的商业信息'],
      },
      {
        title: '6. 知识产权',
        subsections: [
          { title: '6.1 平台内容', text: 'PromptAll平台（包括其设计、标志和我们创建的原创内容）受版权和其他知识产权法律保护。未经书面许可，您不得复制、修改或分发我们的平台内容。' },
          { title: '6.2 反馈', text: '如果您提供有关服务的反馈、建议或想法，您授予我们使用此类反馈的权利，无需向您支付任何补偿。' },
        ],
      },
      { title: '7. 第三方服务', text: 'PromptAll与Google（OAuth、Analytics、AdSense）、Cloudinary、MongoDB Atlas和Vercel等第三方服务集成。您对这些服务的使用受其各自条款和隐私政策的约束。' },
      { title: '8. 广告', text: 'PromptAll可能会展示Google AdSense和其他广告网络提供的广告。广告与用户内容明显区分。我们对第三方广告内容不承担责任。' },
      {
        title: '9. 免责声明',
        intro: 'PromptAll按"原样"和"可用状态"提供，不作任何保证。我们不保证：',
        items: ['服务将不间断、无错误或安全地提供', '任何提示词将产生特定的AI输出或结果', '平台上的内容是准确、完整或可靠的'],
        note: '您使用该服务的风险由您自己承担。',
      },
      { title: '10. 责任限制', text: '在适用法律允许的最大范围内，PromptAll不承担任何间接、附带、特别、后果性或惩罚性损害的责任。我们的总责任不超过$100美元或您在过去12个月内支付给我们的金额中较大的一个。' },
      { title: '11. 赔偿', text: '您同意就因您使用服务、您的用户内容或您违反这些条款而产生的任何索赔、损害、责任和费用（包括法律费用）赔偿并使PromptAll免受损害。' },
      { title: '12. 终止', text: '我们可能随时因违反这些条款的行为暂停或终止您的账户。您可以通过联系privacy@promptall.net删除您的账户。' },
      { title: '13. 适用法律', text: '这些条款受适用法律管辖。争议应通过善意协商解决，如协商失败，则提交具有管辖权的仲裁或法院解决。' },
      { title: '14. 条款变更', text: '我们可能会不时更新这些服务条款。我们将通过在此页面发布更新后的条款并更新"最后更新"日期来通知您。更改后继续使用即表示接受修订后的条款。' },
      {
        title: '15. 联系我们',
        intro: '如果您对这些服务条款有任何疑问，请联系我们：',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    backHome: '← 返回首页',
    toPrivacy: '← 隐私政策',
  },
  es: {
    badge: 'Legal',
    title: 'Términos de Servicio',
    updated: 'Última actualización: 24 de febrero de 2026',
    intro: 'Por favor, lee estos Términos de Servicio cuidadosamente antes de usar PromptAll (promptall.net). Al acceder o usar nuestra plataforma, aceptas estar sujeto a estos términos.',
    sections: [
      { title: '1. Aceptación de Términos', text: 'Al crear una cuenta o usar PromptAll de cualquier manera, confirmas que tienes al menos 13 años y que aceptas estos Términos de Servicio y nuestra Política de Privacidad.' },
      {
        title: '2. Descripción del Servicio',
        intro: 'PromptAll es una plataforma comunitaria para compartir, descubrir y explorar prompts de IA. El servicio incluye:',
        items: ['Navegar y buscar una biblioteca de prompts de IA', 'Enviar y publicar tus propios prompts', 'Interactuar con prompts mediante likes, comentarios y guardados', 'Crear un perfil público como creador de prompts de IA', 'Soporte multilingüe para acceso global'],
        note: 'Nos reservamos el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento.',
      },
      {
        title: '3. Cuentas de Usuario',
        subsections: [
          { title: '3.1 Registro', text: 'Puedes registrarte con email/contraseña o Google Sign-In. Eres responsable de mantener la confidencialidad de tus credenciales y de toda la actividad que ocurra en tu cuenta.' },
          { title: '3.2 Precisión de la Cuenta', text: 'Aceptas proporcionar información precisa, actual y completa, y actualizarla cuando sea necesario.' },
          { title: '3.3 Seguridad de la Cuenta', text: 'Notifícanos inmediatamente en privacy@promptall.net si sospechas acceso no autorizado a tu cuenta.' },
        ],
      },
      {
        title: '4. Contenido del Usuario',
        subsections: [
          { title: '4.1 Tu Contenido', text: 'Conservas la propiedad de los prompts, descripciones, imágenes y otros contenidos que envías ("Contenido del Usuario"). Al enviar contenido, otorgas a PromptAll una licencia mundial, no exclusiva y libre de regalías para mostrar, distribuir y promocionar tu contenido en la plataforma.' },
          {
            title: '4.2 Estándares de Contenido',
            intro: 'Aceptas que tu contenido no:',
            items: ['Viole ninguna ley o regulación aplicable', 'Infrinja derechos de propiedad intelectual de terceros', 'Contenga material dañino, abusivo, amenazante, obsceno o difamatorio', 'Incluya información personal de otros sin su consentimiento', 'Promueva actividades ilegales o autolesiones', 'Contenga malware, spam o contenido engañoso'],
          },
          { title: '4.3 Eliminación de Contenido', text: 'Nos reservamos el derecho de eliminar cualquier contenido que viole estos términos, sin previo aviso.' },
        ],
      },
      {
        title: '5. Conducta Prohibida',
        intro: 'No puedes:',
        items: ['Usar el servicio para ningún propósito ilegal', 'Intentar acceder sin autorización a cualquier parte del servicio', 'Usar herramientas automatizadas para raspar, rastrear o descargar contenido sin permiso', 'Hacerse pasar por cualquier persona o entidad', 'Interferir con la integridad o rendimiento del servicio', 'Eludir controles de acceso o limitaciones de uso', 'Usar la plataforma para enviar mensajes comerciales no solicitados'],
      },
      {
        title: '6. Propiedad Intelectual',
        subsections: [
          { title: '6.1 Contenido de la Plataforma', text: 'La plataforma PromptAll está protegida por derechos de autor y otras leyes de propiedad intelectual. No puedes reproducir, modificar o distribuir nuestro contenido sin permiso escrito.' },
          { title: '6.2 Comentarios', text: 'Si proporcionas comentarios, sugerencias o ideas sobre el servicio, nos otorgas el derecho de usar dichos comentarios sin obligación de compensarte.' },
        ],
      },
      { title: '7. Servicios de Terceros', text: 'PromptAll se integra con servicios de terceros incluyendo Google (OAuth, Analytics, AdSense), Cloudinary, MongoDB Atlas y Vercel. Su uso está sujeto a sus respectivos términos y políticas de privacidad.' },
      { title: '8. Publicidad', text: 'PromptAll puede mostrar anuncios de Google AdSense y otras redes publicitarias. Los anuncios se distinguen claramente del contenido del usuario.' },
      {
        title: '9. Exención de Garantías',
        intro: 'PromptAll se proporciona "tal cual" sin garantías de ningún tipo. No garantizamos que:',
        items: ['El servicio será ininterrumpido, libre de errores o seguro', 'Los prompts producirán resultados de IA específicos', 'El contenido en la plataforma sea preciso, completo o confiable'],
        note: 'El uso del servicio es bajo tu propio riesgo.',
      },
      { title: '10. Limitación de Responsabilidad', text: 'En la máxima medida permitida por la ley, PromptAll no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos. Nuestra responsabilidad total no excederá $100 USD o el monto que nos pagaste en los últimos 12 meses.' },
      { title: '11. Indemnización', text: 'Aceptas indemnizar y mantener indemne a PromptAll de cualquier reclamación, daño, responsabilidad y gastos (incluidos honorarios legales) que surjan de tu uso del servicio.' },
      { title: '12. Terminación', text: 'Podemos suspender o terminar tu cuenta en cualquier momento por conducta que viole estos términos. Puedes eliminar tu cuenta contactando a privacy@promptall.net.' },
      { title: '13. Ley Aplicable', text: 'Estos términos se regirán por la ley aplicable. Las disputas se resolverán mediante negociación de buena fe y, si fracasa, mediante arbitraje vinculante o tribunal competente.' },
      { title: '14. Cambios en los Términos', text: 'Podemos actualizar estos Términos de Servicio de vez en cuando. Te notificaremos publicando los términos actualizados en esta página. El uso continuo constituye la aceptación de los términos revisados.' },
      {
        title: '15. Contáctanos',
        intro: 'Si tienes preguntas sobre estos Términos de Servicio, contáctanos:',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    backHome: '← Volver al inicio',
    toPrivacy: '← Política de Privacidad',
  },
  fr: {
    badge: 'Légal',
    title: 'Conditions d\'Utilisation',
    updated: 'Dernière mise à jour : 24 février 2026',
    intro: 'Veuillez lire attentivement ces Conditions d\'Utilisation avant d\'utiliser PromptAll (promptall.net). En accédant à notre plateforme, vous acceptez d\'être lié par ces conditions.',
    sections: [
      { title: '1. Acceptation des conditions', text: 'En créant un compte ou en utilisant PromptAll, vous confirmez avoir au moins 13 ans et accepter ces Conditions d\'Utilisation et notre Politique de Confidentialité.' },
      {
        title: '2. Description du service',
        intro: 'PromptAll est une plateforme communautaire pour partager, découvrir et explorer des prompts IA. Le service comprend :',
        items: ['Naviguer et rechercher une bibliothèque de prompts IA', 'Soumettre et publier vos propres prompts', 'Interagir avec les prompts via les likes, commentaires et sauvegardes', 'Créer un profil public en tant que créateur de prompts IA', 'Support multilingue pour un accès mondial'],
        note: 'Nous nous réservons le droit de modifier, suspendre ou interrompre tout aspect du service à tout moment.',
      },
      {
        title: '3. Comptes utilisateurs',
        subsections: [
          { title: '3.1 Inscription', text: 'Vous pouvez vous inscrire avec email/mot de passe ou Google Sign-In. Vous êtes responsable de la confidentialité de vos identifiants et de toutes les activités sur votre compte.' },
          { title: '3.2 Exactitude des informations', text: 'Vous acceptez de fournir des informations exactes, à jour et complètes, et de les mettre à jour rapidement.' },
          { title: '3.3 Sécurité du compte', text: 'Notifiez-nous immédiatement à privacy@promptall.net si vous suspectez un accès non autorisé à votre compte.' },
        ],
      },
      {
        title: '4. Contenu utilisateur',
        subsections: [
          { title: '4.1 Votre contenu', text: 'Vous conservez la propriété des prompts, descriptions, images et autres contenus que vous soumettez ("Contenu Utilisateur"). En soumettant du contenu, vous accordez à PromptAll une licence mondiale, non exclusive et libre de redevances pour afficher, distribuer et promouvoir votre contenu sur la plateforme.' },
          {
            title: '4.2 Standards de contenu',
            intro: 'Vous acceptez que votre contenu ne :',
            items: ['Viole aucune loi ou réglementation applicable', 'Ne porte pas atteinte aux droits de propriété intellectuelle de tiers', 'Ne contienne pas de matériel nuisible, abusif, menaçant, obscène ou diffamatoire', 'N\'inclue pas les informations personnelles d\'autres personnes sans leur consentement', 'Ne promeuve pas des activités illégales ou des automutilations', 'Ne contienne pas de logiciels malveillants, de spam ou de contenu trompeur'],
          },
          { title: '4.3 Suppression de contenu', text: 'Nous nous réservons le droit de supprimer tout contenu qui viole ces conditions, sans préavis.' },
        ],
      },
      {
        title: '5. Conduite interdite',
        intro: 'Vous ne pouvez pas :',
        items: ['Utiliser le service à des fins illégales', 'Tenter d\'accéder sans autorisation à toute partie du service', 'Utiliser des outils automatisés pour gratter, explorer ou télécharger du contenu en masse sans permission', 'Usurper l\'identité de toute personne ou entité', 'Interférer avec l\'intégrité ou les performances du service', 'Contourner tout contrôle d\'accès ou limitation d\'utilisation', 'Utiliser la plateforme pour envoyer des messages commerciaux non sollicités'],
      },
      {
        title: '6. Propriété intellectuelle',
        subsections: [
          { title: '6.1 Contenu de la plateforme', text: 'La plateforme PromptAll est protégée par le droit d\'auteur et d\'autres lois sur la propriété intellectuelle. Vous ne pouvez pas reproduire, modifier ou distribuer notre contenu sans permission écrite.' },
          { title: '6.2 Commentaires', text: 'Si vous fournissez des commentaires, suggestions ou idées sur le service, vous nous accordez le droit de les utiliser sans obligation de vous compenser.' },
        ],
      },
      { title: '7. Services tiers', text: 'PromptAll s\'intègre avec des services tiers notamment Google (OAuth, Analytics, AdSense), Cloudinary, MongoDB Atlas et Vercel. Votre utilisation est soumise à leurs conditions et politiques de confidentialité respectives.' },
      { title: '8. Publicité', text: 'PromptAll peut afficher des publicités de Google AdSense et d\'autres réseaux publicitaires. Les publicités sont clairement distinguées du contenu utilisateur.' },
      {
        title: '9. Exclusion de garanties',
        intro: 'PromptAll est fourni "tel quel" sans aucune garantie. Nous ne garantissons pas que :',
        items: ['Le service sera ininterrompu, sans erreur ou sécurisé', 'Les prompts produiront des résultats IA spécifiques', 'Le contenu sur la plateforme est précis, complet ou fiable'],
        note: 'Vous utilisez le service à vos propres risques.',
      },
      { title: '10. Limitation de responsabilité', text: 'Dans la mesure maximale permise par la loi, PromptAll ne sera pas responsable des dommages indirects, accessoires, spéciaux, consécutifs ou punitifs. Notre responsabilité totale ne dépassera pas 100 $ USD ou le montant que vous nous avez payé au cours des 12 derniers mois.' },
      { title: '11. Indemnisation', text: 'Vous acceptez d\'indemniser et de tenir indemne PromptAll de toute réclamation, dommage, responsabilité et dépense (y compris les honoraires d\'avocat) découlant de votre utilisation du service.' },
      { title: '12. Résiliation', text: 'Nous pouvons suspendre ou résilier votre compte à tout moment pour une conduite qui viole ces conditions. Vous pouvez supprimer votre compte en contactant privacy@promptall.net.' },
      { title: '13. Droit applicable', text: 'Ces conditions sont régies par le droit applicable. Les litiges seront résolus par négociation de bonne foi et, en cas d\'échec, par arbitrage contraignant ou tribunal compétent.' },
      { title: '14. Modifications des conditions', text: 'Nous pouvons mettre à jour ces Conditions d\'Utilisation de temps à autre. Nous vous informerons en publiant les conditions mises à jour sur cette page. L\'utilisation continue constitue l\'acceptation des conditions révisées.' },
      {
        title: '15. Nous contacter',
        intro: 'Si vous avez des questions sur ces Conditions d\'Utilisation, veuillez nous contacter :',
        contactBlock: { name: 'PromptAll', email: 'privacy@promptall.net', site: 'promptall.net' },
      },
    ],
    backHome: '← Retour à l\'accueil',
    toPrivacy: '← Politique de confidentialité',
  },
};

type ContentKey = keyof typeof CONTENT;
type SubsectionType = { title: string; text?: string; intro?: string; items?: string[] };

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
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

                {section.intro && <p>{section.intro}</p>}

                {section.subsections?.map((sub: SubsectionType) => (
                  <div key={sub.title} className="mb-4">
                    <h3 className="font-semibold text-slate-800 mb-2">{sub.title}</h3>
                    <div className="text-slate-600 space-y-2">
                      {sub.text && <p>{sub.text}</p>}
                      {sub.intro && <p>{sub.intro}</p>}
                      {sub.items && (
                        <ul className="list-disc pl-5 space-y-1">
                          {sub.items.map((item: string, i: number) => <li key={i}>{item}</li>)}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}

                {section.items && (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.items.map((item: string, i: number) => <li key={i}>{item}</li>)}
                  </ul>
                )}

                {section.note && <p>{section.note}</p>}
                {section.text && <p>{section.text}</p>}

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
          <Link href={`/${locale}/privacy`} className="text-sm text-slate-500 hover:text-slate-700">{content.toPrivacy}</Link>
        </div>
      </div>
    </div>
  );
}
