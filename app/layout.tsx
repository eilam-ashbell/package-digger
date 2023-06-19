import SearchPackage from '@/components/SearchPackage'
import '@/styles/globals.css'
import 'react-tooltip/dist/react-tooltip.css'
import 'react-toastify/dist/ReactToastify.css';
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-100`}>
        <div className='px-8 py-4 flex bg-white border-b border-gray-300'>
            <SearchPackage />
        </div>
        {children}</body>
    </html>
  )
}
