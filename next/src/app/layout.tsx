export const metadata = {
  title: 'Bahrain Properties',
  description: 'Where Real Estate meets AI.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
