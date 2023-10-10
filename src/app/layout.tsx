import './globals.css'
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { SideNav } from './layout-client'

const inter = Montserrat({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stable isotope data of precipitation over the Indonesian Maritime Continent',
  description:
    'Precipitation Isotope data in Indonesian Maritime Continent (IMC) gathered by Atmospheric Science Research Group of Institute Technology Bandung (KKSAITB), Faculty of Advanced Science and Technology Kumamoto University, and Indonesian Meteorology, Climatology, and Geophysical Agency (BMKG). The monthly stable isotope data colected from 62 stations spread throughout the Indonesian archipelago from September 2010 to September 2017',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen w-screen">
          <SideNav>{children}</SideNav>
        </div>
      </body>
    </html>
  )
}
