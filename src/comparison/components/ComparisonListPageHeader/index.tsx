'use client';

import React, { useMemo } from 'react';
import {Button } from '@nextui-org/react';
import Link from 'next/link';

import PageTitle from '@/common/components/PageTitle';
import { COMPARISON_CREATE_ROUTE } from '@/common/constants/routes';


export default function ComparisonListPageHeader() {
    const sideContent = useMemo(() => {
        return (
            <Button
                as={Link}
                href={COMPARISON_CREATE_ROUTE}
                size="lg"
                color="primary"
                className="w-full sm:w-fit"
            >
                Create New Comparison
            </Button>
        );
    }, []);

    return (
        <header>
            <PageTitle
                title="Comparisons"
                subtitle="Set up and view comparisons between folders to identify duplicates. Choose a primary Root Folder and compare it with other folders to detect and manage duplicate files across directories."
                rightSideContent={sideContent}
            />
        </header>
    );
}
