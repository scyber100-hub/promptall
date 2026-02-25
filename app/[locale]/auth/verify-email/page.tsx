'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = params.locale as string;
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }

    fetch('/api/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStatus('success');
          setMessage('Your email has been verified!');
        } else {
          setStatus('error');
          setMessage(data.error || 'Verification failed.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      });
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="mx-auto mb-4 h-12 w-12 text-indigo-500 animate-spin" />
            <p className="text-gray-600">Verifying your email…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              href={`/${locale}/auth/signin`}
              className="inline-block bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-gray-500 mb-6">{message}</p>
            <Link
              href={`/${locale}`}
              className="inline-block text-indigo-600 hover:underline"
            >
              Go to Home
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
