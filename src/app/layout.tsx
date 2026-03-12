import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'Obliq — RBAC Platform',
  description: 'Dynamic Role-Based Access Control System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: 'DM Sans, sans-serif',
              fontSize:   '14px',
              borderRadius: '10px',
              border: '1px solid #F0EDE8',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            },
            success: {
              iconTheme: { primary: '#F04E1F', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  )
}