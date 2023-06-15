import '@/styles/globals.css'

export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app',
}

export default function PackageLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
            <div className='w-full max-w-screen-xl m-auto my-6 px-6'>
                {children}
            </div>
    )
}
