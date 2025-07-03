import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Consulta CRC',
  description: 'Created with JsvrDev',
  generator: 'jsvr.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
