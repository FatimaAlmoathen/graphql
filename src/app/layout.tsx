// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Image from 'next/image'
import pixelatedCloud from './pixelated cloud.png'
import Head from 'next/head'

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
        <Image
          src={pixelatedCloud}
          alt="Pixelated cloud background"
          fill
          className="object-cover -z-50"
          priority
          quality={100}
          placeholder="blur"
        />
        
        {/* Main content*/}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}