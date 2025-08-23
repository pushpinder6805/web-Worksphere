'use client';
import { get } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AdvisorsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const [err, setErr] = useState<string>('');
  useEffect(() => {
    get('/api/v1.0/advisors/').then((data:any) => {
      setItems(Array.isArray(data) ? data : (data.results || []));
    }).catch(e => setErr(String(e)));
  }, []);

  const filtered = items.filter(a => (a.name || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h1 className="text-xl font-semibold">Advisors</h1>
        <input className="input max-w-xs" placeholder="Search..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.map((a:any, i:number) => (
          <div key={i} className="border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-200" />
              <div>
                <div className="font-medium">{a.name || a.username || 'Advisor'}</div>
                <div className="text-xs text-gray-500">{a.skills?.map((s:any)=>s.name).join(', ')}</div>
              </div>
            </div>
            <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto mt-3">{JSON.stringify(a, null, 2)}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
