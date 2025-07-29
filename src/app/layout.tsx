// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Image from 'next/image'
import pixelatedCloud from './pixelated cloud.png'

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
      <body className={`${inter.className} relative min-h-screen`}>
        {/* Background Image*/}
        <div className="absolute inset-0 -z-50 h-full w-full">
        <Image
          src={pixelatedCloud}
          alt="Pixelated cloud background"
          fill
          className="object-cover"
          priority
          quality={100}
          placeholder="blur"
        />
      </div>
        
        {/* Main content*/}
        <div className="relative z-10 min-h-screen w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}