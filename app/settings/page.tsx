'use client';
import { get, patch, post } from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { logout } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { user, token } = useAuth();
  const [advisor, setAdvisor] = useState<any>(null);
  const [err, setErr] = useState('');
  const [forms, setForms] = useState<any>({
    aboutme: { about_me: '' },
    pricing: { per_minute: 0 },
    language: { language: 'en' },
    timezone: { timezone: 'UTC' },
    availability: { day: 'Mon', start: '09:00', end: '17:00' },
    device: { device_id: '', platform: 'web', token: '' },
  });

  useEffect(() => {
    get('/api/v1.0/profile/advisor/').then(setAdvisor).catch(()=>{});
  }, []);

  const doPatch = async (path:string, body:any) => {
    try { await patch(path, body); alert('Saved'); }
    catch(e:any) { setErr(String(e)); }
  };

  const saveDevice = async () => {
    try { await post('/api/v1.0/profile/devices/', forms.device); alert('Device saved'); }
    catch(e:any) { setErr(String(e)); }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <h1 className="text-xl font-semibold mb-2">Account</h1>
        {user && (
          <div className="space-y-2 mb-4">
            <div className="text-sm">
              <span className="font-medium">Username:</span> {user.username}
            </div>
            <div className="text-sm">
              <span className="font-medium">Email:</span> {user.email}
            </div>
            {user.is_advisor && (
              <div className="text-sm">
                <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  Advisor Account
                </span>
              </div>
            )}
          </div>
        )}
        <div className="flex gap-2">
          <button className="btn text-red-600 border-red-200 hover:bg-red-50" onClick={logout}>
            Sign Out
          </button>
        </div>
        {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Advisor Profile</h2>
        {advisor ? <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto">{JSON.stringify(advisor, null, 2)}</pre> : <p className="text-sm">No advisor profile yet.</p>}
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">About Me</h2>
        <textarea className="input" value={forms.aboutme.about_me} onChange={e=>setForms({...forms, aboutme: { about_me: e.target.value }})} />
        <button className="btn mt-2" onClick={()=>doPatch('/api/v1.0/profile/advisor/aboutme/', forms.aboutme)}>Save</button>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Pricing</h2>
        <input className="input" type="number" value={forms.pricing.per_minute} onChange={e=>setForms({...forms, pricing: { per_minute: Number(e.target.value) }})} />
        <div className="flex gap-2 mt-2">
          <button className="btn" onClick={()=>doPatch('/api/v1.0/profile/pricing/', forms.pricing)}>Update (PATCH)</button>
          <button className="btn" onClick={()=>post('/api/v1.0/profile/pricing/', forms.pricing).then(()=>alert('Set via POST')).catch((e:any)=>setErr(String(e)))}>Set (POST)</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Language</h2>
        <input className="input" value={forms.language.language} onChange={e=>setForms({...forms, language: { language: e.target.value }})} />
        <button className="btn mt-2" onClick={()=>doPatch('/api/v1.0/profile/language/', forms.language)}>Save</button>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Timezone</h2>
        <input className="input" value={forms.timezone.timezone} onChange={e=>setForms({...forms, timezone: { timezone: e.target.value }})} />
        <button className="btn mt-2" onClick={()=>doPatch('/api/v1.0/profile/timezone/', forms.timezone)}>Save</button>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Availability</h2>
        <div className="grid gap-2">
          <input className="input" placeholder="Day" value={forms.availability.day} onChange={e=>setForms({...forms, availability: {...forms.availability, day: e.target.value }})} />
          <input className="input" placeholder="Start (HH:MM)" value={forms.availability.start} onChange={e=>setForms({...forms, availability: {...forms.availability, start: e.target.value }})} />
          <input className="input" placeholder="End (HH:MM)" value={forms.availability.end} onChange={e=>setForms({...forms, availability: {...forms.availability, end: e.target.value }})} />
          <button className="btn mt-2" onClick={()=>post('/api/v1.0/profile/availability/', forms.availability).then(()=>alert('Availability saved')).catch((e:any)=>setErr(String(e)))}>Save</button>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Device</h2>
        <div className="grid gap-2">
          <input className="input" placeholder="Device ID" value={forms.device.device_id} onChange={e=>setForms({...forms, device: {...forms.device, device_id: e.target.value}})} />
          <input className="input" placeholder="Platform" value={forms.device.platform} onChange={e=>setForms({...forms, device: {...forms.device, platform: e.target.value}})} />
          <input className="input" placeholder="Push Token" value={forms.device.token} onChange={e=>setForms({...forms, device: {...forms.device, token: e.target.value}})} />
          <button className="btn mt-2" onClick={saveDevice}>Save Device</button>
        </div>
      </div>
    </div>
  );
}
