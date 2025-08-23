'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/advisors', label: 'Advisors' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/wallet', label: 'Wallet' },
  { href: '/settings', label: 'Settings' },
] as const;



export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="border-b sticky top-0 bg-white/80 backdrop-blur z-50">
      <div className="container flex items-center gap-2 py-3">
        <div className="font-bold text-lg">Worksphere</div>
        <div className="flex gap-1">
          {links.map(l => {
            const active = pathname === l.href;
            return (
              <Link key={l.href} href={l.href} className={`navlink ${active ? 'navactive' : ''}`}>
                {l.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
