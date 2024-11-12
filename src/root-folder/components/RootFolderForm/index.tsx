import React from 'react';
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
                        isDisabled={isEditMode}
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
