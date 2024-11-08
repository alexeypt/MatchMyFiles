'use client';

import React, { useMemo } from 'react';

import Breadcrumbs, { BreadcrumbItemModel } from '@/common/components/Breadcrumbs';
import PageTitle from '@/common/components/PageTitle';
import { COMPARISON_ROUTE } from '@/common/constants/routes';


export default function ComparisonCreatePageHeader() {
    const breadcrumbs: BreadcrumbItemModel[] = useMemo(() => {
        return [
            {
                href: COMPARISON_ROUTE,
                title: 'All Comparisons',
                isCurrent: false
            },
            {
                title: 'New Comparison',
                isCurrent: true
            }
        ];
    }, []);

    return (
        <header className="flex flex-col gap-4">
            <Breadcrumbs items={breadcrumbs} />
            <PageTitle title="New Comparison" />
        </header>
    );
}
