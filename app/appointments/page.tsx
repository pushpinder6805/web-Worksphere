'use client';
import { get, post } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function AppointmentsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const [form, setForm] = useState<any>({ advisor_id: '', length_minutes: 15, notes: '' });
  const [orderResp, setOrderResp] = useState<any>(null);
  const [confirmInput, setConfirmInput] = useState<any>({ order_id: '', payment_reference: '' });
  const [reviewInput, setReviewInput] = useState<any>({ appointment_id: '', rating: 5, comment: '' });

  const refresh = () => {
    get('/api/v1.0/appointments/').then((data:any)=>{
      setItems(Array.isArray(data) ? data : (data.results || []));
    }).catch(e => setErr(String(e)));
  };

  useEffect(() => { refresh(); }, []);

  const order = async () => {
    try {
      const r = await post('/api/v1.0/appointments/order/', form);
      setOrderResp(r);
      setConfirmInput((c:any) => ({...c, order_id: r?.order_id || r?.id || '' }));
    } catch(e:any) { setErr(String(e)); }
  };

  const confirm = async () => {
    try {
      const r = await post('/api/v1.0/appointments/order/confirm/', confirmInput);
      alert('Order confirmed'); refresh();
    } catch(e:any) { setErr(String(e)); }
  };

  const review = async () => {
    try {
      await post(`/api/v1.0/appointments/${reviewInput.appointment_id}/review/`, { rating: reviewInput.rating, comment: reviewInput.comment });
      alert('Review submitted'); refresh();
    } catch(e:any) { setErr(String(e)); }
  };

  const open = async (id:string) => {
    try {
      const r:any = await get(`/api/v1.0/appointments/${id}/open/`);
      const url = r?.url || r?.link || (typeof r === 'string' ? r : '');
      if (url) window.open(url, '_blank');
    } catch(e:any) { setErr(String(e)); }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">Appointments</h1>
          <button onClick={refresh} className="btn">Refresh</button>
        </div>
        {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
        <div className="space-y-3">
          {items.map((a:any) => (
            <div key={a.id || a.appointment_id} className="border rounded-2xl p-3">
              <div className="flex items-center justify-between">
                <div className="font-medium">#{a.id || a.appointment_id}</div>
                <button onClick={()=>open(String(a.id || a.appointment_id))} className="btn">Open</button>
              </div>
              <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto mt-2">{JSON.stringify(a, null, 2)}</pre>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-2">New Appointment</h2>
        <div className="grid gap-2">
          <label className="label">Advisor ID</label>
          <input className="input" value={form.advisor_id} onChange={e=>setForm({...form, advisor_id: e.target.value})} />
          <label className="label">Length (minutes)</label>
          <input className="input" type="number" value={form.length_minutes} onChange={e=>setForm({...form, length_minutes: Number(e.target.value)})} />
          <label className="label">Notes</label>
          <textarea className="input" value={form.notes} onChange={e=>setForm({...form, notes: e.target.value})} />
          <button className="btn btn-primary mt-2" onClick={order}>Order</button>
        </div>
        {orderResp && <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto mt-3">{JSON.stringify(orderResp, null, 2)}</pre>}

        <h2 className="text-lg font-semibold mt-6 mb-2">Confirm Order</h2>
        <div className="grid gap-2">
          <label className="label">Order ID</label>
          <input className="input" value={confirmInput.order_id} onChange={e=>setConfirmInput({...confirmInput, order_id: e.target.value})} />
          <label className="label">Payment Reference</label>
          <input className="input" value={confirmInput.payment_reference} onChange={e=>setConfirmInput({...confirmInput, payment_reference: e.target.value})} />
          <button className="btn mt-2" onClick={confirm}>Confirm</button>
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-2">Review</h2>
        <div className="grid gap-2">
          <label className="label">Appointment ID</label>
          <input className="input" value={reviewInput.appointment_id} onChange={e=>setReviewInput({...reviewInput, appointment_id: e.target.value})} />
          <label className="label">Rating</label>
          <input className="input" type="number" min={1} max={5} value={reviewInput.rating} onChange={e=>setReviewInput({...reviewInput, rating: Number(e.target.value)})} />
          <label className="label">Comment</label>
          <textarea className="input" value={reviewInput.comment} onChange={e=>setReviewInput({...reviewInput, comment: e.target.value})} />
          <button className="btn mt-2" onClick={review}>Submit Review</button>
        </div>
      </div>
    </div>
  );
}
