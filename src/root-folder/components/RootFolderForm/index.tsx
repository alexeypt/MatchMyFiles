import React, { ReactNode, useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import FormSubmitPanel from '@/common/components/FormSubmitPanel';
import InputField from '@/common/components/InputField';
import TextAreaField from '@/common/components/TextAreaField';
import { nameof } from '@/common/helpers/nameHelper';
import { isRequired } from '@/common/helpers/validationHelper';
import RootFolderFormModel from '@/root-folder/models/rootFolderFormModel';


interface SourceGroupFormProps {
    onSubmit: (data: RootFolderFormModel, formikHelpers: FormikHelpers<RootFolderFormModel>) => void;
    initialValues: RootFolderFormModel;
    isEditMode: boolean;
    customButtonNode?: ReactNode;
    onClose?: () => void;
}

const SourceGroupValidationSchema: Yup.ObjectSchema<RootFolderFormModel> = Yup.object({
    id: Yup.number().required(),
    name: Yup.string().required('Name is a required field'),
    folderPath: Yup.string().required('Folder Path is a required field'),
    description: Yup.string().default('')
});

export default function RootFolderForm({
    onSubmit,
    initialValues,
    isEditMode,
    customButtonNode,
    onClose
}: SourceGroupFormProps) {
    return (
        <div>
            <Formik<RootFolderFormModel>
                initialValues={initialValues}
                validationSchema={SourceGroupValidationSchema}
                onSubmit={onSubmit}
                validateOnMount
            >
                {({ values }) => (
                    <Form
                        className="flex flex-col gap-5"
                        noValidate
                    >
                        <InputField
                            isRequired={isRequired(SourceGroupValidationSchema, 'name')}
                            name={nameof<RootFolderFormModel>('name')}
                            label="Name"
                            variant="bordered"
                        />
                        <TextAreaField
                            isRequired={isRequired(SourceGroupValidationSchema, 'description')}
                            name={nameof<RootFolderFormModel>('description')}
                            label="Description"
                            variant="bordered"
                        />
                        <InputField
                            isRequired={isRequired(SourceGroupValidationSchema, 'folderPath')}
                            name={nameof<RootFolderFormModel>('folderPath')}
                            label="Folder Path"
                            variant="bordered"
                            description={isEditMode && values.folderPath !== initialValues.folderPath
                                ? "Folder Path update will lead to the Root Folder and Comparisons (where this Root Folder is used) reprocessing"
                                : null
                            }
                        />
                        <FormSubmitPanel
                            isEditMode={isEditMode}
                            customNode={customButtonNode}
                            onClose={onClose}
                        />
                    </Form>
                )}
            </Formik>
        </div>
    );
}
