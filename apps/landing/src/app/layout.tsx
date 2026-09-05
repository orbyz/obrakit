import { DM_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import Aoscompo from '@/utils/aos'
const font = DM_Sans({ subsets: ['latin'] })
// Vercel Plugins
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from '@vercel/analytics/next';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={`${font.className}`}>
          <Aoscompo>
            <Header />
            {children}
            <Footer />
          </Aoscompo>
          <ScrollToTop />
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
