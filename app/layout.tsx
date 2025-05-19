import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BookStore Admin",
  description: "Admin dashboard for BookStore application",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  )
}
