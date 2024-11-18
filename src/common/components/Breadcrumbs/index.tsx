import { useEffect, useRef } from 'react';
import { BreadcrumbItem, Breadcrumbs as NextUIBreadcrumbs, BreadcrumbsProps as NextUIBreadcrumbsProps } from '@nextui-org/react';


export interface BreadcrumbItemModel {
    href?: string;
    title: string;
    isCurrent: boolean;
}

interface BreadcrumbsProps extends Omit<NextUIBreadcrumbsProps, 'children'> {
    items: BreadcrumbItemModel[];
}

export default function Breadcrumbs({ items, ...restProps }: BreadcrumbsProps) {
    const navRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (navRef.current) {
            // for some reason NextUI adds href attribute to li node but that's invalid
            Array.from(navRef.current.querySelectorAll('li')).forEach(liNode => liNode.removeAttribute('href'));
        }
    }, []);

    return (
        <NextUIBreadcrumbs
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
        </NextUIBreadcrumbs>
    );
}
