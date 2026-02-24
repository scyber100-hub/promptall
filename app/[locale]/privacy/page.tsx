import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | PromptAll',
  description: 'Learn how PromptAll collects, uses, and protects your personal information.',
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Legal</p>
          <h1 className="text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: February 24, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-slate max-w-none">

          {/* Intro */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-10 text-slate-700 text-sm leading-relaxed">
            Welcome to <strong>PromptAll</strong> ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit <strong>promptall.net</strong>.
          </div>

          <Section title="1. Information We Collect">
            <SubSection title="1.1 Information You Provide">
              <ul>
                <li><strong>Account Information:</strong> Name, email address, username, and password when you register.</li>
                <li><strong>Profile Information:</strong> Optional bio or avatar image you add to your profile.</li>
                <li><strong>Content:</strong> Prompts, descriptions, tags, comments, and result images you submit.</li>
                <li><strong>Communications:</strong> Messages you send to us for support or feedback.</li>
              </ul>
            </SubSection>
            <SubSection title="1.2 Automatically Collected Information">
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, prompts viewed, actions taken (likes, bookmarks, copies).</li>
                <li><strong>Device Information:</strong> Browser type, operating system, IP address, and referring URLs.</li>
                <li><strong>Cookies:</strong> Session cookies for authentication and preference cookies for language settings.</li>
              </ul>
            </SubSection>
            <SubSection title="1.3 Third-Party Sign-In">
              <p>If you sign in with Google, we receive your name, email address, and profile picture from Google. We do not receive your Google password.</p>
            </SubSection>
          </Section>

          <Section title="2. How We Use Your Information">
            <ul>
              <li>Provide, operate, and maintain the PromptAll platform</li>
              <li>Create and manage your account</li>
              <li>Display your prompts and public profile to other users</li>
              <li>Send service-related emails (account verification, password reset)</li>
              <li>Analyze usage trends to improve our service</li>
              <li>Detect and prevent fraud, abuse, or security incidents</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p>We do <strong>not</strong> sell your personal data to third parties.</p>
          </Section>

          <Section title="3. Cookies and Tracking">
            <p>We use the following types of cookies:</p>
            <table className="w-full text-sm border-collapse mt-4">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left px-4 py-2 rounded-tl-lg font-semibold text-slate-700">Type</th>
                  <th className="text-left px-4 py-2 font-semibold text-slate-700">Purpose</th>
                  <th className="text-left px-4 py-2 rounded-tr-lg font-semibold text-slate-700">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-2.5 text-slate-600">Essential</td>
                  <td className="px-4 py-2.5 text-slate-600">Authentication session</td>
                  <td className="px-4 py-2.5 text-slate-600">Session</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="px-4 py-2.5 text-slate-600">Preference</td>
                  <td className="px-4 py-2.5 text-slate-600">Language selection</td>
                  <td className="px-4 py-2.5 text-slate-600">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-slate-600">Analytics</td>
                  <td className="px-4 py-2.5 text-slate-600">Google Analytics (anonymous usage stats)</td>
                  <td className="px-4 py-2.5 text-slate-600">2 years</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-sm text-slate-500">You can disable cookies in your browser settings. Note that some features may not function properly without essential cookies.</p>
          </Section>

          <Section title="4. Third-Party Services">
            <p>We use the following third-party services which may process your data under their own privacy policies:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Anonymous usage analytics — <a href="https://policies.google.com/privacy" target="_blank" className="text-indigo-600 hover:underline">Google Privacy Policy</a></li>
              <li><strong>Google OAuth:</strong> Optional sign-in — <a href="https://policies.google.com/privacy" target="_blank" className="text-indigo-600 hover:underline">Google Privacy Policy</a></li>
              <li><strong>Cloudinary:</strong> Image storage and delivery — <a href="https://cloudinary.com/privacy" target="_blank" className="text-indigo-600 hover:underline">Cloudinary Privacy Policy</a></li>
              <li><strong>MongoDB Atlas:</strong> Database hosting — <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" className="text-indigo-600 hover:underline">MongoDB Privacy Policy</a></li>
              <li><strong>Vercel:</strong> Hosting and deployment — <a href="https://vercel.com/legal/privacy-policy" target="_blank" className="text-indigo-600 hover:underline">Vercel Privacy Policy</a></li>
              <li><strong>Google AdSense:</strong> Advertising (when enabled) — <a href="https://policies.google.com/privacy" target="_blank" className="text-indigo-600 hover:underline">Google Privacy Policy</a></li>
            </ul>
          </Section>

          <Section title="5. Data Retention">
            <ul>
              <li><strong>Account data:</strong> Retained while your account is active. Deleted within 30 days of account deletion request.</li>
              <li><strong>Public prompts:</strong> Retained until you delete them or request account deletion.</li>
              <li><strong>Usage logs:</strong> Retained for up to 90 days for security and debugging purposes.</li>
            </ul>
          </Section>

          <Section title="6. Your Rights">
            <p>Depending on your location, you may have the following rights:</p>
            <ul>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data.</li>
              <li><strong>Erasure:</strong> Request deletion of your account and associated data.</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing emails at any time.</li>
            </ul>
            <p>To exercise these rights, contact us at <strong>privacy@promptall.net</strong>.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>PromptAll is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided personal data, we will delete it promptly.</p>
          </Section>

          <Section title="8. International Data Transfers">
            <p>PromptAll operates globally. Your data may be stored and processed in the United States or other countries where our service providers operate. We ensure appropriate safeguards are in place for such transfers.</p>
          </Section>

          <Section title="9. Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of material changes by posting the new policy on this page and updating the "Last updated" date. Continued use of PromptAll after changes constitutes acceptance of the revised policy.</p>
          </Section>

          <Section title="10. Contact Us">
            <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
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
          <Link href={`/${locale}/terms`} className="text-sm text-slate-500 hover:text-slate-700">Terms of Service →</Link>
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
