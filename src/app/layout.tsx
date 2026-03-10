// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'Mon Portfolio',
    template: '%s | Mon Portfolio'
  },
  description: 'Portfolio créé avec Next.js et TypeScript',
  keywords: ['portfolio', 'next.js', 'react', 'typescript'],
  authors: [{ name: 'Votre Nom' }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow bg-white">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}