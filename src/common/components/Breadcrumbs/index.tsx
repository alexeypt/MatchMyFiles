import { useEffect, useRef } from 'react';
import { BreadcrumbItem, Breadcrumbs as HeroUIBreadcrumbs, BreadcrumbsProps as HeroUIBreadcrumbsProps } from '@heroui/breadcrumbs';


export interface BreadcrumbItemModel {
    href?: string;
    title: string;
    isCurrent: boolean;
}

interface BreadcrumbsProps extends Omit<HeroUIBreadcrumbsProps, 'children'> {
    items: BreadcrumbItemModel[];
}

export default function Breadcrumbs({ items, ...restProps }: BreadcrumbsProps) {
    const navRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (navRef.current) {
            // for some reason HeroUI adds href attribute to li node but that's invalid
            Array.from(navRef.current.querySelectorAll('li')).forEach(liNode => liNode.removeAttribute('href'));
        }
    }, []);

    return (
        <HeroUIBreadcrumbs
            ref={navRef}
            color="primary"
            underline="hover"
            {...restProps}
        >
            {
                items.map(item => (
                    <BreadcrumbItem
                        key={item.title}
                        href={item.href}
                        color="primary"
                        isCurrent={item.isCurrent}
                        classNames={{ item: 'text-blue-600 hover:opacity-100 active:opacity-100 min-h-6' }}
                    >
                        {item.title}
                    </BreadcrumbItem>
                ))
            }
        </HeroUIBreadcrumbs>
    );
}
