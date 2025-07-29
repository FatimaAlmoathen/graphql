// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Image from 'next/image'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GRAPHQL',
  description: 'description',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative h-full overflow-x-hidden`}>
        {/* Background Image*/}
        <div className="fixed inset-0 -z-50 min-h-screen">
        <Image
          src="/pixelated-cloud.png"
          alt="Pixelated cloud background"
          fill
          className="object-cover"
          priority
          quality={100}
          sizes="100vw"
        />
      </div>
        
        {/* Main content*/}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  )
}