
'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Breadcrumbs, { BreadcrumbItemModel } from '@/common/components/Breadcrumbs';
import ConfirmableButton from '@/common/components/ConfirmableButton';
import PageTitle from '@/common/components/PageTitle';
import { COMPARISON_ROUTE } from '@/common/constants/routes';
import { action } from '@/common/helpers/actionHelper';
import regenerateComparison from '@/comparison/data-access/commands/regenerateComparison';
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

    const onRegenerate = useCallback(async () => {
        const [isSuccess] = await action(async () => {
            await regenerateComparison(comparison.id);
        }, {
            successText: 'The Comparison has been successfully regenerated',
            errorText: 'Failed to regenerate the Comparison'
        });

        if (isSuccess) {
            router.refresh();
        }
    }, [router, comparison.id]);

    const sideContent = useMemo(() => {
        return (
            <div className="flex gap-5">
                <ConfirmableButton
                    confirmTitle="Regenerate Comparison"
                    confirmDescription={
                        (
                            <p>
                                <span className="font-bold">{comparison.name}</span> Comparison
                                will be regenerate. All existing comparison results will be removed without restoring possibilities.
                            </p>
                        )
                    }
                    confirmYesButtonLabel="Yes, Regenerate This Comparison"
                    confirmNoButtonLabel="Cancel, Keep This Comparison"
                    type="button"
                    color="warning"
                    onClick={onRegenerate}
                    size="lg"
                >
                    Regenerate
                </ConfirmableButton>
                <ConfirmableButton
                    confirmTitle="Delete Comparison"
                    confirmDescription={
                        (
                            <p>
                                <span className="font-bold">{comparison.name}</span> Comparison
                                will be removed without restoring possibilities.
                            </p>
                        )
                    }
                    confirmYesButtonLabel="Yes, Delete This Comparison"
                    confirmNoButtonLabel="Cancel, Keep This Comparison"
                    type="button"
                    color="danger"
                    onClick={onDelete}
                    size="lg"
                >
                    Delete
                </ConfirmableButton>
            </div>
        );
    }, [comparison.name, onRegenerate, onDelete]);

    const pageTitle = `Comparison: ${comparison.name}`;

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
