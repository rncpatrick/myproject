// app/components/layout/Footer.tsx
import Link from 'next/link'
import type { SocialLink } from '@/lib/types/navigation'

const socialLinks: SocialLink[] = [
  { platform: 'github', url: 'https://github.com/votreprofil', label: 'GitHub' },
  { platform: 'linkedin', url: 'https://linkedin.com/in/votreprofil', label: 'LinkedIn' },
  { platform: 'twitter', url: 'https://twitter.com/votreprofil', label: 'Twitter' },
]

export default function Footer() {
  const currentYear: number = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-300">
              © {currentYear} Mon Portfolio. Tous droits réservés.
            </p>
          </div>
          
          <div className="flex space-x-6">
            {socialLinks.map((link) => (
              <Link
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}