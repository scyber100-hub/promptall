import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service | PromptAll',
  description: 'Read the Terms of Service for using the PromptAll platform.',
};

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-slate-400">Last updated: February 24, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-slate max-w-none">

          {/* Intro */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-10 text-slate-700 text-sm leading-relaxed">
            Please read these Terms of Service carefully before using <strong>PromptAll</strong> (promptall.net). By accessing or using our platform, you agree to be bound by these terms. If you disagree with any part of these terms, you may not access the service.
          </div>

          <Section title="1. Acceptance of Terms">
            <p>By creating an account or using PromptAll in any way, you confirm that you are at least 13 years old and that you agree to these Terms of Service and our Privacy Policy. If you are using PromptAll on behalf of an organization, you represent that you have authority to bind that organization to these terms.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>PromptAll is a community platform for sharing, discovering, and exploring AI prompts. The service includes:</p>
            <ul>
              <li>Browsing and searching a library of AI prompts</li>
              <li>Submitting and publishing your own prompts</li>
              <li>Interacting with prompts via likes, comments, and bookmarks</li>
              <li>Creating a public profile as an AI prompt creator</li>
              <li>Multi-language support for global accessibility</li>
            </ul>
            <p>We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.</p>
          </Section>

          <Section title="3. User Accounts">
            <SubSection title="3.1 Registration">
              <p>You may register using email/password or Google Sign-In. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.</p>
            </SubSection>
            <SubSection title="3.2 Account Accuracy">
              <p>You agree to provide accurate, current, and complete information. You must promptly update your account information to keep it accurate.</p>
            </SubSection>
            <SubSection title="3.3 Account Security">
              <p>Notify us immediately at <a href="mailto:privacy@promptall.net" className="text-indigo-600 hover:underline">privacy@promptall.net</a> if you suspect unauthorized access to your account. We are not liable for losses resulting from unauthorized use of your credentials.</p>
            </SubSection>
          </Section>

          <Section title="4. User Content">
            <SubSection title="4.1 Your Content">
              <p>You retain ownership of prompts, descriptions, images, and other content you submit ("User Content"). By submitting content, you grant PromptAll a worldwide, non-exclusive, royalty-free license to display, distribute, and promote your content on the platform.</p>
            </SubSection>
            <SubSection title="4.2 Content Standards">
              <p>You agree that your content will not:</p>
              <ul>
                <li>Violate any applicable law or regulation</li>
                <li>Infringe intellectual property rights of any third party</li>
                <li>Contain harmful, abusive, threatening, obscene, or defamatory material</li>
                <li>Include personal information of others without their consent</li>
                <li>Promote illegal activities or self-harm</li>
                <li>Contain malware, spam, or deceptive content</li>
              </ul>
            </SubSection>
            <SubSection title="4.3 Content Removal">
              <p>We reserve the right to remove any content that violates these terms or that we deem harmful to the community, without prior notice.</p>
            </SubSection>
          </Section>

          <Section title="5. Prohibited Conduct">
            <p>You may not:</p>
            <ul>
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to any part of the service or other users' accounts</li>
              <li>Use automated tools to scrape, crawl, or bulk-download content without permission</li>
              <li>Impersonate any person or entity</li>
              <li>Interfere with or disrupt the integrity or performance of the service</li>
              <li>Circumvent any access controls or usage limitations</li>
              <li>Use the platform to send unsolicited commercial messages</li>
            </ul>
          </Section>

          <Section title="6. Intellectual Property">
            <SubSection title="6.1 Platform Content">
              <p>The PromptAll platform, including its design, logos, and original content created by us, is protected by copyright and other intellectual property laws. You may not reproduce, modify, or distribute our platform content without written permission.</p>
            </SubSection>
            <SubSection title="6.2 Feedback">
              <p>If you provide feedback, suggestions, or ideas about the service, you grant us the right to use such feedback without any obligation to compensate you.</p>
            </SubSection>
          </Section>

          <Section title="7. Third-Party Services">
            <p>PromptAll integrates with third-party services including Google (OAuth, Analytics, AdSense), Cloudinary, MongoDB Atlas, and Vercel. Your use of these services is subject to their respective terms and privacy policies. We are not responsible for the practices or content of third-party services.</p>
          </Section>

          <Section title="8. Advertising">
            <p>PromptAll may display advertisements served by Google AdSense and other ad networks. Advertisements are clearly distinguished from user content. We are not responsible for the content of third-party advertisements.</p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>PromptAll is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, express or implied. We do not warrant that:</p>
            <ul>
              <li>The service will be uninterrupted, error-free, or secure</li>
              <li>Any prompts will produce specific AI outputs or results</li>
              <li>Content on the platform is accurate, complete, or reliable</li>
            </ul>
            <p>Your use of the service is at your own risk.</p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>To the maximum extent permitted by applicable law, PromptAll and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service, including but not limited to loss of data, loss of profits, or loss of business opportunities.</p>
            <p>Our total liability for any claim arising from these terms or your use of the service shall not exceed the greater of $100 USD or the amount you paid us in the past 12 months.</p>
          </Section>

          <Section title="11. Indemnification">
            <p>You agree to indemnify, defend, and hold harmless PromptAll and its operators from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of the service, your User Content, or your violation of these terms.</p>
          </Section>

          <Section title="12. Termination">
            <p>We may suspend or terminate your account at any time, with or without notice, for conduct that we believe violates these terms or is harmful to other users, us, or third parties.</p>
            <p>You may delete your account at any time by contacting us at <a href="mailto:privacy@promptall.net" className="text-indigo-600 hover:underline">privacy@promptall.net</a>. Upon termination, your right to use the service will immediately cease. Provisions that by their nature should survive termination will remain in effect.</p>
          </Section>

          <Section title="13. Governing Law">
            <p>These terms shall be governed by and construed in accordance with applicable law. Any disputes arising under these terms shall be resolved through good-faith negotiation. If negotiation fails, disputes shall be submitted to binding arbitration or a court of competent jurisdiction.</p>
          </Section>

          <Section title="14. Changes to Terms">
            <p>We may update these Terms of Service from time to time. We will notify you of significant changes by posting the updated terms on this page and updating the "Last updated" date. Your continued use of PromptAll after changes constitutes acceptance of the revised terms.</p>
          </Section>

          <Section title="15. Contact Us">
            <p>If you have questions about these Terms of Service, please contact us:</p>
            <div className="bg-slate-50 rounded-xl p-5 mt-3 text-sm text-slate-700 space-y-1">
              <p><strong>PromptAll</strong></p>
              <p>Email: <a href="mailto:privacy@promptall.net" className="text-indigo-600 hover:underline">privacy@promptall.net</a></p>
              <p>Website: <a href="https://promptall.net" className="text-indigo-600 hover:underline">promptall.net</a></p>
            </div>
          </Section>

        </div>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4">
          <Link href={`/${locale}`} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">← Back to Home</Link>
          <Link href={`/${locale}/privacy`} className="text-sm text-slate-500 hover:text-slate-700">← Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      <div className="text-slate-600 leading-relaxed space-y-3 text-[15px]">{children}</div>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <div className="text-slate-600 space-y-2">{children}</div>
    </div>
  );
}
