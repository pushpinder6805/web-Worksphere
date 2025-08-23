import './globals.css'
import Nav from '@/components/Nav'
import AuthGuard from '@/components/AuthGuard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Worksphere Web',
  description: 'Frontend for Worksphere API',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <Nav />
          <main className="container py-6">
            {children}
          </main>
        </AuthGuard>
      </body>
    </html>
  )
}
