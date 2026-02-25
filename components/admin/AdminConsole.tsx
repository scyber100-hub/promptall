'use client';
import { useState, useEffect } from 'react';
import { Bell, BellOff, Check } from 'lucide-react';

interface AdminPrompt {
  _id: string;
  title: string;
  status: 'active' | 'hidden' | 'deleted';
  reportCount: number;
  authorUsername: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  slug?: string;
}

interface AdminUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'suspended';
  promptCount: number;
  createdAt: string;
}

interface AdminConsoleProps {
  initialPrompts: AdminPrompt[];
  initialUsers: AdminUser[];
}

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  hidden: 'bg-yellow-100 text-yellow-800',
  deleted: 'bg-red-100 text-red-800',
  suspended: 'bg-red-100 text-red-800',
  user: 'bg-gray-100 text-gray-700',
  admin: 'bg-indigo-100 text-indigo-800',
};

interface Notification {
  _id: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export function AdminConsole({ initialPrompts, initialUsers }: AdminConsoleProps) {
  const [tab, setTab] = useState<'prompts' | 'users' | 'notifications'>('prompts');
  const [prompts, setPrompts] = useState<AdminPrompt[]>(initialPrompts);
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/notifications?unread=true')
      .then((r) => r.json())
      .then((d) => {
        setUnreadCount(d.unreadCount ?? 0);
      })
      .catch(() => {});
  }, []);

  const loadNotifications = async () => {
    const res = await fetch('/api/admin/notifications');
    const d = await res.json();
    setNotifications(d.notifications ?? []);
    setUnreadCount(0);
  };

  const markAllRead = async () => {
    await fetch('/api/admin/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: 'all' }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const updatePromptStatus = async (id: string, status: 'active' | 'hidden' | 'deleted') => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setPrompts((prev) => prev.map((p) => p._id === id ? { ...p, status } : p));
      }
    } finally {
      setLoadingId(null);
    }
  };

  const deletePrompt = async (id: string) => {
    if (!confirm('Permanently delete this prompt?')) return;
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/prompts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setPrompts((prev) => prev.filter((p) => p._id !== id));
      }
    } finally {
      setLoadingId(null);
    }
  };

  const updateUser = async (id: string, update: { status?: string; role?: string }) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      if (res.ok) {
        const data = await res.json();
        setUsers((prev) => prev.map((u) => u._id === id ? { ...u, ...update } as AdminUser : u));
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Console</h1>
        <button
          onClick={() => { setTab('notifications'); loadNotifications(); }}
          className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500"
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-gray-200">
        {(['prompts', 'users', 'notifications'] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t === 'notifications') loadNotifications(); }}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            {t}
            {t === 'notifications' && unreadCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Prompts Tab */}
      {tab === 'prompts' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 text-xs uppercase">
                <th className="pb-3 pr-4">Title</th>
                <th className="pb-3 pr-4">Author</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Reports</th>
                <th className="pb-3 pr-4">Likes</th>
                <th className="pb-3 pr-4">Views</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {prompts.map((p) => (
                <tr key={p._id} className="text-sm">
                  <td className="py-3 pr-4 max-w-xs truncate font-medium text-gray-900">{p.title}</td>
                  <td className="py-3 pr-4 text-gray-500">@{p.authorUsername}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={p.reportCount >= 5 ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                      {p.reportCount}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{p.likeCount}</td>
                  <td className="py-3 pr-4 text-gray-600">{p.viewCount}</td>
                  <td className="py-3">
                    <div className="flex gap-2 items-center">
                      {p.status !== 'active' && (
                        <button
                          onClick={() => updatePromptStatus(p._id, 'active')}
                          disabled={loadingId === p._id}
                          className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                        >
                          Restore
                        </button>
                      )}
                      {p.status !== 'hidden' && (
                        <button
                          onClick={() => updatePromptStatus(p._id, 'hidden')}
                          disabled={loadingId === p._id}
                          className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => deletePrompt(p._id)}
                        disabled={loadingId === p._id}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {prompts.length === 0 && (
            <p className="text-center text-gray-400 py-8">No prompts found</p>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-gray-500 text-xs uppercase">
                <th className="pb-3 pr-4">Name</th>
                <th className="pb-3 pr-4">Email</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 pr-4">Prompts</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u._id} className="text-sm">
                  <td className="py-3 pr-4">
                    <div className="font-medium text-gray-900">{u.name}</div>
                    <div className="text-xs text-gray-400">@{u.username}</div>
                  </td>
                  <td className="py-3 pr-4 text-gray-500">{u.email}</td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[u.role]}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.status === 'active' ? 'bg-green-100 text-green-800' : STATUS_BADGE.suspended}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-gray-600">{u.promptCount}</td>
                  <td className="py-3">
                    <div className="flex gap-2 items-center flex-wrap">
                      {u.status === 'active' ? (
                        <button
                          onClick={() => updateUser(u._id, { status: 'suspended' })}
                          disabled={loadingId === u._id}
                          className="text-xs px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUser(u._id, { status: 'active' })}
                          disabled={loadingId === u._id}
                          className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200 disabled:opacity-50"
                        >
                          Restore
                        </button>
                      )}
                      {u.role === 'user' ? (
                        <button
                          onClick={() => updateUser(u._id, { role: 'admin' })}
                          disabled={loadingId === u._id}
                          className="text-xs px-2 py-1 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:opacity-50"
                        >
                          Make Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => updateUser(u._id, { role: 'user' })}
                          disabled={loadingId === u._id}
                          className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                        >
                          Revoke Admin
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p className="text-center text-gray-400 py-8">No users found</p>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {tab === 'notifications' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{notifications.length} notifications</p>
            {notifications.some((n) => !n.read) && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
              >
                <Check size={12} /> Mark all as read
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <BellOff size={36} className="mx-auto mb-3 opacity-30" />
              <p>No notifications</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {notifications.map((n) => (
                <li key={n._id} className={`py-3 flex gap-3 ${n.read ? 'opacity-60' : ''}`}>
                  <span className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-gray-300' : 'bg-indigo-500'}`} />
                  <div>
                    <p className="text-sm text-gray-800">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
