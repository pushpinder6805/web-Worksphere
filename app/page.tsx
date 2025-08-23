'use client';
import { get, post } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function Page() {
  const [profile, setProfile] = useState<any>(null);
  const [err, setErr] = useState<string>('');
  useEffect(() => {
    get('/api/v1.0/profile/')
      .then(setProfile)
      .catch(e => setErr(String(e)));
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Welcome</h2>
        <p className="text-sm text-gray-600">This dashboard pulls data from your Worksphere API.</p>
        {err && <p className="text-red-600 mt-2 text-sm">{err}</p>}
        {profile ? (
          <div className="mt-4">
            <div className="font-medium">User</div>
            <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
          </div>
        ) : (
          <p className="text-sm mt-2">No profile yet. Make sure your token is set in Settings → Auth.</p>
        )}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <a href="/advisors" className="btn btn-primary">Browse Advisors</a>
          <a href="/appointments" className="btn">View Appointments</a>
          <a href="/wallet" className="btn">Wallet</a>
          <a href="/settings" className="btn">Settings</a>
        </div>
      </div>
    </div>
  );
}
