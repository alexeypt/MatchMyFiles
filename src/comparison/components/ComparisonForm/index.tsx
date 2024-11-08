import React from 'react';
import { SelectItem } from '@nextui-org/react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import CheckboxGroupField from '@/common/components/CheckboxGroupField';
import DropdownField from '@/common/components/DropdownField';
import FormSubmitPanel from '@/common/components/FormSubmitPanel';
import InputField from '@/common/components/InputField';
import TextAreaField from '@/common/components/TextAreaField';
import { nameof } from '@/common/helpers/nameHelper';
import { isRequired } from '@/common/helpers/validationHelper';
import ComparisonFormModel from '@/comparison/models/comparisonFormModel';
import { RootFolderNameModel } from '@/root-folder/data-access/queries/getRootFolderNamesQuery';


interface ComparisonFormProps {
    rootFolders: RootFolderNameModel[];
    onSubmit: (data: ComparisonFormModel, formikHelpers: FormikHelpers<ComparisonFormModel>) => void;
    initialValues: ComparisonFormModel;
    isEditMode: boolean;
    onClose?: () => void;
}

const ComparisonValidationSchema: Yup.ObjectSchema<ComparisonFormModel> = Yup.object({
    id: Yup.number().required(),
    name: Yup.string().required('Name is a required field'),
    description: Yup.string().default(''),
    primaryRootFolderId: Yup.string().required('Primary Root Folder is a required field'),
    rootFolderIdsToCompareWith: Yup.array().required('Please Select Root Folders').of(Yup.string().required())
});

export default function ComparisonForm({
    rootFolders,
    onSubmit,
    initialValues,
    isEditMode,
    onClose
}: ComparisonFormProps) {
    return (
        <div>
            <Formik<ComparisonFormModel>
                initialValues={initialValues}
                validationSchema={ComparisonValidationSchema}
                onSubmit={onSubmit}
                validateOnMount
            >
                <Form
                    className="flex flex-col gap-5"
                    noValidate
                >
                    <InputField
                        isRequired={isRequired(ComparisonValidationSchema, 'name')}
                        name={nameof<ComparisonFormModel>('name')}
                        label="Name"
                        variant="bordered"
                    />
                    <DropdownField
                        name={nameof<ComparisonFormModel>('primaryRootFolderId')}
                        isRequired={isRequired(ComparisonValidationSchema, 'primaryRootFolderId')}
                        label="Primary Root Folder"
                        variant="bordered"
                        items={rootFolders}
                    >
                        {
                            item => (
                                <SelectItem
                                    key={item.id}
                                    textValue={`${item.name} (${item.path})`}
                                >
                                    {item.name} ({item.path})
                                </SelectItem>
                            )
                        }
                    </DropdownField>
                    <TextAreaField
                        isRequired={isRequired(ComparisonValidationSchema, 'description')}
                        name={nameof<ComparisonFormModel>('description')}
                        label="Description"
                        variant="bordered"
                    />
                    <CheckboxGroupField
                        isRequired={isRequired(ComparisonValidationSchema, 'rootFolderIdsToCompareWith')}
                        name={nameof<ComparisonFormModel>('rootFolderIdsToCompareWith')}
                        label="Select Root Folders To Compare With"
                        items={rootFolders.map(rootFolder => ({
                            value: rootFolder.id.toString(),
                            label: `${rootFolder.name} (${rootFolder.path})`
                        }))}
                    />
                    <FormSubmitPanel
                        isEditMode={isEditMode}
                        onClose={onClose}
                    />
                </Form>
            </Formik>
        </div>
    );
}
