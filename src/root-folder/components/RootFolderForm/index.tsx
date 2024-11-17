import React, { ReactNode, useMemo } from 'react';
import { Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';

import FormSubmitPanel from '@/common/components/FormSubmitPanel';
import InputField from '@/common/components/InputField';
import TextAreaField from '@/common/components/TextAreaField';
import { nameof } from '@/common/helpers/nameHelper';
import { isRequired } from '@/common/helpers/validationHelper';
import RootFolderFormModel from '@/root-folder/models/rootFolderFormModel';


interface RootFolderFormProps {
    onSubmit: (data: RootFolderFormModel, formikHelpers: FormikHelpers<RootFolderFormModel>) => void;
    initialValues: RootFolderFormModel;
    isEditMode: boolean;
    customButtonNode?: ReactNode;
    onClose?: () => void;
}

const RootFolderValidationSchemaGenerator: (isEditMode: boolean) => Yup.ObjectSchema<RootFolderFormModel> = (isEditMode: boolean) => Yup.object({
    id: Yup.number().required(),
    name: isEditMode ? Yup.string().required('Display Name is a required field') : Yup.string().optional().default(''),
    folderPath: Yup.string().required('Folder Path is a required field'),
    description: Yup.string().default('')
});

export default function RootFolderForm({
    onSubmit,
    initialValues,
    isEditMode,
    customButtonNode,
    onClose
}: RootFolderFormProps) {
    const rootFolderValidationSchema = useMemo(() => {
        return RootFolderValidationSchemaGenerator(isEditMode);
    }, []);
    
    return (
        <div>
            <Formik<RootFolderFormModel>
                initialValues={initialValues}
                validationSchema={rootFolderValidationSchema}
                onSubmit={onSubmit}
                validateOnMount
            >
                {({ values }) => (
                    <Form
                        className="flex flex-col gap-7"
                        noValidate
                    >
                        <InputField
                            isRequired={isRequired(rootFolderValidationSchema, 'folderPath')}
                            name={nameof<RootFolderFormModel>('folderPath')}
                            label="Folder Path"
                            variant="bordered"
                            description={isEditMode && values.folderPath !== initialValues.folderPath
                                ? "Folder Path update will lead to the Root Folder and Comparisons (where this Root Folder is used) reprocessing"
                                : null
                            }
                        />
                        <InputField
                            isRequired={isRequired(rootFolderValidationSchema, 'name')}
                            name={nameof<RootFolderFormModel>('name')}
                            label="Display Name"
                            variant="bordered"
                        />
                        <TextAreaField
                            isRequired={isRequired(rootFolderValidationSchema, 'description')}
                            name={nameof<RootFolderFormModel>('description')}
                            label="Description"
                            variant="bordered"
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
