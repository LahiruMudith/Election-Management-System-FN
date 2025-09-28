import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Script from "next/script" // <-- Import Script

export const metadata: Metadata = {
    title: 'v0 App',
    description: 'Created with v0',
    generator: 'v0.app',
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <head>
            <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
            {/* PayHere SDK script loaded before any interactive code */}
            <Script
                src="https://www.payhere.lk/lib/payhere.js"
                strategy="beforeInteractive"
            />
        </head>
        <body>
        <Toaster position="top-center" reverseOrder={false} />
        {children}
        <Analytics />
        </body>
        </html>
    )
}