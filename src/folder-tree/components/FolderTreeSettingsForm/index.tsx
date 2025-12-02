import React, { Key, useCallback } from 'react';
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Form, Formik, FormikHelpers } from 'formik';

import InputField from '@/common/components/InputField';
import { nameof } from '@/common/helpers/nameHelper';
import FolderTreeOrdering from '@/folder-tree/models/folderTreeOrdering';


interface FolderTreeSettingsFormProps {
    ordering: FolderTreeOrdering;
    onUpdateSearchQuery: (searchQuery: string) => void;
    onUpdateOrdering: (ordering: FolderTreeOrdering) => void;
}

interface FolderTreeSettingsFormModel {
    searchQuery: string;
}

const FORM_INITIAL_VALUES: FolderTreeSettingsFormModel = {
    searchQuery: ''
};

export default function FolderTreeSettingsForm({ ordering, onUpdateOrdering, onUpdateSearchQuery }: FolderTreeSettingsFormProps) {
    const onSubmit = useCallback((values: FolderTreeSettingsFormModel, formikHelpers: FormikHelpers<FolderTreeSettingsFormModel>) => {
        onUpdateSearchQuery(values.searchQuery);

        formikHelpers.resetForm({
            values: {
                searchQuery: values.searchQuery
            }
        });

        return Promise.resolve();
    }, [onUpdateSearchQuery]);

    const onOrderingChange = useCallback((newValue: (Set<Key> | 'all')) => {
        const value = (newValue as Set<number>).values().next().value;
        if (value) {
            onUpdateOrdering(+value as FolderTreeOrdering);
        }
    }, [onUpdateOrdering]);

    return (
        <div>
            <Formik<FolderTreeSettingsFormModel>
                initialValues={FORM_INITIAL_VALUES}
                onSubmit={onSubmit}
                validateOnMount
            >
                {({ isSubmitting, dirty }) => (
                    <Form
                        className="flex flex-row gap-8 items-center flex-wrap"
                        noValidate
                    >
                        <div className="basis-[calc(50%-1rem)] sm:basis-auto">
                            <InputField
                                isRequired={false}
                                name={nameof<FolderTreeSettingsFormModel>('searchQuery')}
                                label="Search Query"
                                variant="bordered"
                                className="max-w-80"
                            />
                        </div>
                        <div className="basis-[calc(50%-1rem)] sm:basis-auto">
                            <Button
                                type="submit"
                                isDisabled={!dirty}
                                isLoading={isSubmitting}
                                color="primary"
                                size="lg"
                                className={!dirty ? 'opacity-60 w-full sm:w-fit' : 'w-full sm:w-fit'}
                            >
                                Search
                            </Button>
                        </div>
                        <div className="w-full sm:w-auto grow flex justify-end">
                            <Select
                                className="sm:max-w-xs"
                                label="Select ordering"
                                variant="bordered"
                                selectedKeys={[ordering.toString()]}
                                onSelectionChange={onOrderingChange}
                            >
                                <SelectItem key={FolderTreeOrdering.ByName}>Order by Name</SelectItem>
                                <SelectItem key={FolderTreeOrdering.BySize}>Order by Size</SelectItem>
                            </Select>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
