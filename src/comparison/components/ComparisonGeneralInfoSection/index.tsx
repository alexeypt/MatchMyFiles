'use client';

import React, { ReactNode, useCallback, useMemo } from 'react';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import KeyValueList from '@/common/components/KeyValueList';
import PageSection from '@/common/components/PageSection';
import { action } from '@/common/helpers/actionHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { roundNumber } from '@/common/helpers/numberHelper';
import { ComparisonProcessingStatus } from '@/clients/prisma/browser';
import ComparisonForm from '@/comparison/components/ComparisonForm';
import ComparisonReprocessButton from '@/comparison/components/ComparisonReprocessButton';
import updateComparison from '@/comparison/data-access/commands/updateComparisonCommand';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';
import ComparisonFormModel from '@/comparison/models/comparisonFormModel';
import { RootFolderNameModel } from '@/root-folder/data-access/queries/getRootFolderNamesQuery';


interface ComparisonGeneralInfoSectionProps {
    comparison: ComparisonDetailsModel;
    rootFolders: RootFolderNameModel[];
}

export default function ComparisonGeneralInfoSection({ comparison, rootFolders }: ComparisonGeneralInfoSectionProps) {
    const router = useRouter();

    const onSubmit = useCallback(async (data: ComparisonFormModel, formikHelpers: FormikHelpers<ComparisonFormModel>) => {
        const [isSuccess, result] = await action(async () => {
            return await updateComparison(ComparisonFormModel.mapToUpdateModel(data));
        }, {
            successText: 'The Comparison has been successfully updated',
            errorText: 'Failed to update the Comparison'
        });

        if (isSuccess) {
            formikHelpers.resetForm({ values: data });

            if (result?.isReprocessingRequired) {
                router.refresh();
            }
        }
    }, [router]);

    const {
        duplicatedFilesCount,
        duplicatedFilesSize,
        totalFilesCount,
        size
    } = comparison.primaryRootFolder;

    const comparisonDetailsMap = useMemo(() => {
        const duplicatedFilesCountPercent = totalFilesCount > 0
            ? roundNumber(duplicatedFilesCount / totalFilesCount * 100.0, 1)
            : 0;
        const duplicatedFilesSizePercent = size > 0
            ? roundNumber(duplicatedFilesSize / size * 100.0, 1)
            : 0;

        return new Map<string, ReactNode>([
            [
                'Init Date',
                (
                    <FormattedDateTime
                        key={+comparison.createdAt}
                        dateTime={comparison.createdAt}
                    />
                )
            ],
            [
                'Status',
                (
                    <>
                        {comparison.status === ComparisonProcessingStatus.Completed && <span>{comparison.status}</span>}
                        {comparison.status === ComparisonProcessingStatus.Failed && <span className="text-red-700">{comparison.status}</span>}
                        {comparison.status === ComparisonProcessingStatus.Processing && <span className="text-yellow-700">{comparison.status}</span>}
                    </>
                )
            ],
            [
                'Duplicated Files Count',
                comparison.status === ComparisonProcessingStatus.Completed
                    ? `${duplicatedFilesCount} / ${totalFilesCount} (${duplicatedFilesCountPercent}%)`
                    : null
            ],
            [
                'Duplicated Files Size',
                comparison.status === ComparisonProcessingStatus.Completed
                    ? `${getFormattedSize(duplicatedFilesSize)} / ${getFormattedSize(size)} (${duplicatedFilesSizePercent}%)`
                    : null
            ]
        ]);
    }, [comparison.createdAt, comparison.status, duplicatedFilesCount, duplicatedFilesSize, size, totalFilesCount]);

    const initialFormValues = useMemo(() => {
        return ComparisonFormModel.mapFromComparisonModel(comparison);
    }, [comparison]);

    const reprocessButtonNode = useMemo(() => {
        return (
            <ComparisonReprocessButton
                rootFolders={rootFolders}
                comparison={comparison}
            />
        );
    }, [comparison, rootFolders]);

    return (
        <PageSection
            title="General Info"
            headingLevel={2}
        >
            <div className="flex flex-col gap-9">
                <KeyValueList
                    items={comparisonDetailsMap}
                    skipNullableValues
                />
                <div className="max-w-200 w-full">
                    <ComparisonForm
                        rootFolders={rootFolders}
                        initialValues={initialFormValues}
                        customButtonNode={reprocessButtonNode}
                        isEditMode
                        onSubmit={onSubmit}
                    />
                </div>
            </div>
        </PageSection>
    );
}
