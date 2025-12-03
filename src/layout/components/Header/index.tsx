'use client';

import { useState } from 'react';
import { Link } from '@heroui/link';
import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from '@heroui/navbar';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { COMPARISON_ROUTE, HOME_ROUTE, ROOT_FOLDER_ROUTE } from '@/common/constants/routes';


const NAVIGATION_ITEMS = [
    {
        text: 'Root Folders',
        url: ROOT_FOLDER_ROUTE
    },
    {
        text: 'Comparisons',
        url: COMPARISON_ROUTE
    }
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <Navbar
            maxWidth="2xl"
            isMenuOpen={isMenuOpen}
            classNames={
                {
                    wrapper: 'max-w-(--breakpoint-2xl) px-4 2xl:px-0'
                }
            }
            isBordered
            onMenuOpenChange={setIsMenuOpen}
        >

            <NavbarContent
                className="sm:hidden"
                justify="start"
            >
                <NavbarItem className="h-full">
                    <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} />
                </NavbarItem>
            </NavbarContent>
            <NavbarBrand>
                <Link href={HOME_ROUTE}>
                    <span className="w-10 h-10 mr-3">
                        <Image
                            src="/icon.svg"
                            alt="Match My Files logo that looks like a folder icon split into two halves, one slightly mirrored or offset, suggesting duplication"
                            width={40}
                            height={40}
                            priority
                        />
                    </span>
                    <p className="font-bold text-inherit">Match My Files</p>
                </Link>
            </NavbarBrand>
            <NavbarContent
                className="hidden sm:flex gap-4"
                justify="center"
            >
                {
                    NAVIGATION_ITEMS.map(item => {
                        const isActive = pathname.startsWith(item.url);

                        return (
                            <NavbarItem
                                key={item.url}
                                isActive={isActive}
                            >
                                <Link
                                    color={isActive ? 'primary' : 'foreground'}
                                    href={item.url}
                                    aria-current={isActive ? 'page' : undefined}
                                    isBlock
                                >
                                    {item.text}
                                </Link>
                            </NavbarItem>
                        );
                    })
                }
            </NavbarContent>
            <NavbarMenu>
                {
                    NAVIGATION_ITEMS.map(item => {
                        const isActive = pathname.startsWith(item.url);

                        return (
                            <NavbarMenuItem
                                key={item.url}
                                isActive={isActive}
                            >
                                <Link
                                    color={isActive ? 'primary' : 'foreground'}
                                    href={item.url}
                                    aria-current={isActive ? 'page' : undefined}
                                    isBlock
                                    onPress={() => setIsMenuOpen(false)}
                                >
                                    {item.text}
                                </Link>
                            </NavbarMenuItem>
                        );
                    })
                }
            </NavbarMenu>
        </Navbar>
    );
}
