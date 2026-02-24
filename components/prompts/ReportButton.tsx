'use client';
import { useState } from 'react';
import { Flag } from 'lucide-react';

interface ReportButtonProps {
  promptId: string;
}

const REPORT_REASONS = [
  { value: 'spam', label: 'Spam' },
  { value: 'inappropriate', label: 'Inappropriate content' },
  { value: 'copyright', label: 'Copyright violation' },
  { value: 'other', label: 'Other' },
] as const;

type ReasonValue = typeof REPORT_REASONS[number]['value'];

const STORAGE_KEY = (promptId: string) => `reported_${promptId}`;

export function ReportButton({ promptId }: ReportButtonProps) {
  const alreadyReported = typeof window !== 'undefined'
    ? !!localStorage.getItem(STORAGE_KEY(promptId))
    : false;

  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReasonValue>('spam');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(alreadyReported);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/prompts/${promptId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (res.status === 409) {
        localStorage.setItem(STORAGE_KEY(promptId), '1');
        setDone(true);
        setOpen(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to report');
        return;
      }

      localStorage.setItem(STORAGE_KEY(promptId), '1');
      setDone(true);
      setOpen(false);
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="flex items-center gap-1 text-xs text-gray-400">
        <Flag size={12} />
        Already reported
      </span>
    );
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"
      >
        <Flag size={12} />
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-4">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Report Prompt</h3>

            <div className="space-y-2 mb-4">
              {REPORT_REASONS.map((r) => (
                <label key={r.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{r.label}</span>
                </label>
              ))}
            </div>

            {error && <p className="text-xs text-red-600 mb-3">{error}</p>}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setOpen(false); setError(''); }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
