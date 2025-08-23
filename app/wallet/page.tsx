'use client';
import { get, post } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function WalletPage() {
  const [wallet, setWallet] = useState<any>(null);
  const [txs, setTxs] = useState<any[]>([]);
  const [err, setErr] = useState('');
  const [refill, setRefill] = useState({ amount: '' });
  const [withdraw, setWithdraw] = useState({ amount: '' });

  const refresh = async () => {
    try {
      const w = await get('/api/v1.0/profile/');
      setWallet(w?.wallet || w?.balance ? w : w); // best effort; schema may vary
      const t:any = await get('/api/v1.0/profile/transactions/');
      setTxs(Array.isArray(t) ? t : (t.results || []));
    } catch(e:any) { setErr(String(e)); }
  };
  useEffect(()=>{ refresh(); }, []);

  const requestRefill = async () => {
    try {
      const r = await post('/api/v1.0/profile/refill/request/', { amount: Number(refill.amount) });
      alert('Refill requested. Now confirm it.');
    } catch(e:any) { setErr(String(e)); }
  };

  const confirmRefill = async () => {
    try {
      const r = await post('/api/v1.0/profile/refill/confirm/', { amount: Number(refill.amount) });
      alert('Refill confirmed');
      refresh();
    } catch(e:any) { setErr(String(e)); }
  };

  const doWithdraw = async () => {
    try {
      const r = await post('/api/v1.0/profile/withdraw/', { amount: Number(withdraw.amount) });
      alert('Withdrawal requested');
      refresh();
    } catch(e:any) { setErr(String(e)); }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-semibold">Wallet</h1>
          <button onClick={refresh} className="btn">Refresh</button>
        </div>
        {err && <p className="text-red-600 text-sm mb-2">{err}</p>}
        <pre className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto">{JSON.stringify(wallet, null, 2)}</pre>
        <h2 className="text-lg font-semibold mt-4 mb-2">Transactions</h2>
        <div className="space-y-2">
          {txs.map((t:any, i:number) => (
            <pre key={i} className="text-xs bg-gray-50 p-3 rounded-xl overflow-auto">{JSON.stringify(t, null, 2)}</pre>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold">Refill</h2>
        <div className="grid gap-2">
          <input className="input" placeholder="Amount" value={refill.amount} onChange={e=>setRefill({amount: e.target.value})} />
          <div className="flex gap-2">
            <button className="btn btn-primary" onClick={requestRefill}>Request</button>
            <button className="btn" onClick={confirmRefill}>Confirm</button>
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-6">Withdraw</h2>
        <div className="grid gap-2">
          <input className="input" placeholder="Amount" value={withdraw.amount} onChange={e=>setWithdraw({amount: e.target.value})} />
          <button className="btn" onClick={doWithdraw}>Withdraw</button>
        </div>
      </div>
    </div>
  );
}
