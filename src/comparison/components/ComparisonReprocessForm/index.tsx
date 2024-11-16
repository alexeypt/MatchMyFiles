import React, { useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import CheckboxGroupField from '@/common/components/CheckboxGroupField';
import FormSubmitPanel from '@/common/components/FormSubmitPanel';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { nameof } from '@/common/helpers/nameHelper';
import { isRequired } from '@/common/helpers/validationHelper';
import ComparisonReprocessingFormModel from '@/comparison/models/comparisonReprocessingFormModel';
import { RootFolderNameModel } from '@/root-folder/data-access/queries/getRootFolderNamesQuery';


interface ComparisonReprocessingFormProps {
    rootFolders: RootFolderNameModel[];
    onSubmit: (data: ComparisonReprocessingFormModel, formikHelpers: FormikHelpers<ComparisonReprocessingFormModel>) => void;
    initialValues: ComparisonReprocessingFormModel;
    onClose?: () => void;
}

const ComparisonReprocessingValidationSchema: Yup.ObjectSchema<ComparisonReprocessingFormModel> = Yup.object({
    comparisonId: Yup.number().required(),
    rootFolderIds: Yup.array().required('Please select Root Folders').of(Yup.number().required()),
    rootFolderIdsToReprocess: Yup.array().required('Please select Root Folders').min(1, 'Please select Root Folders').of(Yup.string().required())
});

export default function ComparisonReprocessingForm({
    rootFolders,
    onSubmit,
    initialValues,
    onClose
}: ComparisonReprocessingFormProps) {
    const rootFoldersMap = useMemo(() => {
        return new Map(rootFolders.map(rootFolder => ([rootFolder.id, rootFolder])));
    }, [rootFolders]);

    const rootFolderItems = useMemo(() => {
        return initialValues.rootFolderIds
            .filter(rootFolderId => rootFoldersMap.has(rootFolderId))
            .map(rootFolderId => rootFoldersMap.get(rootFolderId)!)
            .map(rootFolder => ({
                value: rootFolder.id.toString(),
                label: `${rootFolder.name} (${rootFolder.path}, ${getFormattedSize(rootFolder.size)})`
            }));
    }, [initialValues.rootFolderIds, rootFoldersMap]);

    return (
        <div>
            <Formik<ComparisonReprocessingFormModel>
                initialValues={initialValues}
                validationSchema={ComparisonReprocessingValidationSchema}
                onSubmit={onSubmit}
                validateOnMount
            >
                <Form
                    className="flex flex-col gap-5"
                    noValidate
                >
                    <CheckboxGroupField
                        isRequired={isRequired(ComparisonReprocessingValidationSchema, 'rootFolderIdsToReprocess')}
                        name={nameof<ComparisonReprocessingFormModel>('rootFolderIdsToReprocess')}
                        label="Select Root Folders To Reprocess"
                        items={rootFolderItems}
                    />
                    <FormSubmitPanel
                        isEditMode={false}
                        submitButtonLabel="Reprocess"
                        onClose={onClose}
                    />
                </Form>
            </Formik>
        </div>
    );
}
