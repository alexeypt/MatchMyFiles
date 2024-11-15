
"use client";

import React, { ReactNode, useCallback, useMemo } from 'react';
import { FormikHelpers } from 'formik';
import { useRouter } from 'next/navigation';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import KeyValueList from '@/common/components/KeyValueList';
import PageSection from '@/common/components/PageSection';
import { action } from '@/common/helpers/actionHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { roundNumber } from '@/common/helpers/numberHelper';
import ComparisonForm from '@/comparison/components/ComparisonForm';
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
        const duplicatedFilesCountPercent = roundNumber(duplicatedFilesCount / totalFilesCount * 100.0, 1);
        const duplicatedFilesSizePercent = roundNumber(duplicatedFilesSize / size * 100.0, 1);

        return new Map<string, ReactNode>([
            ['Init Date', (
                <FormattedDateTime
                    key={+comparison.createdAt}
                    dateTime={comparison.createdAt}
                />
            )],
            ['Duplicated Files Count', `${duplicatedFilesCount} / ${totalFilesCount} (${duplicatedFilesCountPercent}%)`],
            ['Duplicated Files Size', `${getFormattedSize(duplicatedFilesSize)} / ${getFormattedSize(size)} (${duplicatedFilesSizePercent}%)`]
        ]);
    }, [comparison.createdAt, duplicatedFilesCount, duplicatedFilesSize, size, totalFilesCount]);

    const initialFormValues = useMemo(() => {
        return ComparisonFormModel.mapFromComparisonModel(comparison);
    }, [comparison]);

    return (
        <PageSection
            title="General Info"
            headingLevel={2}
        >
            <div className="flex flex-col gap-9">
                <KeyValueList items={comparisonDetailsMap} />
                <div className="max-w-[50rem] w-full">
                    <ComparisonForm
                        rootFolders={rootFolders}
                        onSubmit={onSubmit}
                        initialValues={initialFormValues}
                        isEditMode
                    />
                </div>
            </div>
        </PageSection>
    );
}
