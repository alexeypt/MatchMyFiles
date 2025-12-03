'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Breadcrumbs, { BreadcrumbItemModel } from '@/common/components/Breadcrumbs';
import ConfirmableButton from '@/common/components/ConfirmableButton';
import PageTitle from '@/common/components/PageTitle';
import { COMPARISON_ROUTE } from '@/common/constants/routes';
import { action } from '@/common/helpers/actionHelper';
import removeComparison from '@/comparison/data-access/commands/removeComparisonCommand';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonDetailsPageHeaderProps {
    comparison: ComparisonDetailsModel;
}

export default function ComparisonDetailsPageHeader({ comparison }: ComparisonDetailsPageHeaderProps) {
    const router = useRouter();

    const onDelete = useCallback(async () => {
        const [isSuccess] = await action(async () => {
            await removeComparison(comparison.id);
        }, {
            successText: 'The Comparison has been successfully removed',
            errorText: 'Failed to remove the Comparison'
        });

        if (isSuccess) {
            router.push(COMPARISON_ROUTE);

            router.refresh();
        }
    }, [router, comparison.id]);

    const sideContent = useMemo(() => {
        return (
            <ConfirmableButton
                className="w-full sm:w-fit"
                confirmTitle="Delete Comparison"
                confirmDescription={
                    (
                        <p>
                            This Comparison will be removed without restoring possibilities.
                        </p>
                    )
                }
                confirmYesButtonLabel="Yes, Delete This Comparison"
                confirmNoButtonLabel="Cancel, Keep This Comparison"
                type="button"
                color="danger"
                size="lg"
                onPress={onDelete}
            >
                Delete
            </ConfirmableButton>
        );
    }, [onDelete]);

    const pageTitle = `Comparison: ${comparison.primaryRootFolder.name}`;

    const breadcrumbs: BreadcrumbItemModel[] = useMemo(() => {
        return [
            {
                href: COMPARISON_ROUTE,
                title: 'All Comparisons',
                isCurrent: false
            },
            {
                title: pageTitle,
                isCurrent: true
            }
        ];
    }, [pageTitle]);

    return (
        <header className="flex flex-col gap-4">
            <Breadcrumbs items={breadcrumbs} />
            <PageTitle
                title={pageTitle}
                rightSideContent={sideContent}
            />
        </header>
    );
}
