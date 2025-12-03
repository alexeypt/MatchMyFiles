import { Link } from '@heroui/link';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Noto_Serif } from 'next/font/google';

import { HOME_ROUTE } from '@/common/constants/routes';
import { Providers } from '@/app/providers';
import Header from '@/layout/components/Header';
import SkipToMainContentButton from '@/layout/components/SkipToMainContentButton';
import { PAGE_CONTAINER_ID } from '@/layout/constants/layoutSelectors';

import './globals.css';


const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter'
});
const notoSerif = Noto_Serif({
    subsets: ['latin'],
    variable: '--font-noto-serif'
});

export const metadata: Metadata = {
    title: 'Match My Files - Simplify Duplicate File Detection and Management',
    description: 'Effortlessly identify and manage duplicate files and folders with Match My Files. Compare directories, save space, and streamline your storage with our smart duplication detection tool.',
    metadataBase: new URL(`http:localhost:${process.env.APP_PORT}`)
};

export default async function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${inter.className} ${inter.variable} ${notoSerif.variable} wrap-anywhere`}>
                <Providers>
                    <div className="flex min-h-screen flex-col">
                        <SkipToMainContentButton />
                        <Header />
                        <div className="flex flex-col justify-between grow">
                            <main
                                className="grow flex flex-col items-center justify-between px-4 md:px-5 2xl:px-0 max-w-(--breakpoint-2xl) w-full mx-auto outline-none"
                                id={PAGE_CONTAINER_ID}
                                tabIndex={-1}
                            >
                                <div className="grow flex flex-col mt-8 mb-12 2xl:mt-10 2xl:mb-16 w-full">
                                    {children}
                                </div>
                            </main>
                            <footer className="flex w-full items-end">
                                <div className="bg-yellow-100 w-full">
                                    <div className="flex max-w-(--breakpoint-2xl) mx-auto h-10 justify-between items-center px-4 2xl:px-0">
                                        <Link
                                            className="text-xs font-bold text-black"
                                            href={HOME_ROUTE}
                                        >
                                            Match My Files v 1.0 (beta)
                                        </Link>
                                        <span className="text-xs">2024</span>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
