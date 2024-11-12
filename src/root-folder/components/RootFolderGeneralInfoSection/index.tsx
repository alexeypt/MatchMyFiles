"use client";

import React, { ReactNode, useCallback, useMemo } from 'react';
import { FormikHelpers } from 'formik';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import KeyValueList from '@/common/components/KeyValueList';
import PageSection from '@/common/components/PageSection';
import { action } from '@/common/helpers/actionHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import RootFolderForm from '@/root-folder/components/RootFolderForm';
import updateRootFolder from '@/root-folder/data-access/commands/updateRootFolderCommand';
import { RootFolderDetailsModel } from '@/root-folder/data-access/queries/getRootFolderQuery';
import RootFolderFormModel from '@/root-folder/models/rootFolderFormModel';


interface RootFolderGeneralInfoSectionProps {
    rootFolder: RootFolderDetailsModel;
}

export default function RootFolderGeneralInfoSection({ rootFolder }: RootFolderGeneralInfoSectionProps) {
    const onSubmit = useCallback(async (data: RootFolderFormModel, formikHelpers: FormikHelpers<RootFolderFormModel>) => {
        const [isSuccess] = await action(async () => {
            await updateRootFolder(RootFolderFormModel.mapToUpdateModel(data));
        }, {
            successText: 'The Root Folder has been successfully updated',
            errorText: 'Failed to update the Root Folder'
        });

        if (isSuccess) {
            formikHelpers.resetForm({ values: data });
        }
    }, []);

    const sourceGroupDetailsMap = useMemo(() => {
        return new Map<string, ReactNode>([
            ['Init Date', (
                <FormattedDateTime
                    key={+rootFolder.createdAt}
                    dateTime={rootFolder.createdAt}
                />
            )],
            ['Folder Path', rootFolder.path],
            ['Total Size', getFormattedSize(rootFolder.size)],
            ['Files Count', rootFolder.filesCount],
            ['Folders Count', rootFolder.foldersCount],
            ['Comparisons Count', rootFolder.comparisonsCount]
        ]);
    }, [rootFolder]);

    const initialFormValues = useMemo(() => {
        return RootFolderFormModel.mapFromRootFolderModel(rootFolder);
    }, [rootFolder]);

    return (
        <PageSection
            title="General Info"
            headingLevel={2}
        >
            <div className="flex flex-col gap-9">
                <KeyValueList items={sourceGroupDetailsMap} />
                <div className="max-w-[50rem] w-full">
                    <RootFolderForm
                        onSubmit={onSubmit}
                        initialValues={initialFormValues}
                        isEditMode
                    />
                </div>
            </div>
        </PageSection>
    );
}
