import { DM_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/Layout/Header'
import Footer from '@/components/Layout/Footer'
import { ThemeProvider } from 'next-themes'
import ScrollToTop from '@/components/ScrollToTop'
import Aoscompo from '@/utils/aos'
const font = DM_Sans({ subsets: ['latin'] })
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='es' suppressHydrationWarning>
      <body className={`${font.className}`}>
        <ThemeProvider
          attribute='class'
          enableSystem={true}
          defaultTheme='system'>
          <Aoscompo>
            <Header />
            {children}
            <Footer />
          </Aoscompo>
          <ScrollToTop />
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
