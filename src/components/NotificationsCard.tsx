import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { AppNotification } from '../api/client';

export function NotificationsCard({ notifications, onRead }: { notifications: AppNotification[]; onRead: (id: number) => Promise<boolean> }) {
  const [savingId, setSavingId] = useState<number | null>(null);
  return <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Notifications</h2>
    <div className="mt-4 space-y-3">{notifications.map(item => <div key={item.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div><p className="text-sm font-bold text-slate-900">{item.title}</p><p className="mt-1 text-xs text-slate-600">{item.message}</p></div>
      <button type="button" disabled={Boolean(item.read_at) || savingId !== null} onClick={async () => { setSavingId(item.id); await onRead(item.id); setSavingId(null); }} className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-teal-700 disabled:text-slate-400">
        <CheckCircle2 className="h-4 w-4" />{item.read_at ? 'Read' : 'Mark as read'}
      </button>
    </div>)}</div>
  </section>;
}
