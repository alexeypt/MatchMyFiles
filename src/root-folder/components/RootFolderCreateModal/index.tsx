import React, { useCallback, useMemo } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal';
import { useRouter } from 'next/navigation';

import Heading from '@/common/components/Heading';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { action } from '@/common/helpers/actionHelper';
import { generateUrl } from '@/common/helpers/urlHelper';
import RootFolderForm from '@/root-folder/components/RootFolderForm';
import createRootFolder from '@/root-folder/data-access/commands/createRootFolderCommand';
import RootFolderFormModel from '@/root-folder/models/rootFolderFormModel';


interface RootFolderCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RootFolderCreateModal({ isOpen, onClose }: RootFolderCreateModalProps) {
    const router = useRouter();

    const onSubmit = useCallback(async (data: RootFolderFormModel) => {
        const [isSuccess, rootFolderId] = await action<number>(async () => {
            return await createRootFolder(RootFolderFormModel.matToCreateModel(data));
        }, {
            successText: 'The Root Folder has been successfully created',
            errorText: 'Failed to create the Root Folder'
        });

        if (isSuccess && rootFolderId) {
            onClose();

            router.push(generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: rootFolderId }));

            router.refresh();
        }
    }, [onClose, router]);

    const initialFormValues = useMemo(() => {
        return RootFolderFormModel.init();
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            size="xl"
            scrollBehavior="inside"
            onClose={onClose}
        >
            <ModalContent>
                {
                    onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <Heading level={2}>
                                    Create Root Folder
                                </Heading>
                            </ModalHeader>
                            <ModalBody>
                                <RootFolderForm
                                    initialValues={initialFormValues}
                                    isEditMode={false}
                                    onSubmit={onSubmit}
                                    onClose={onClose}
                                />
                            </ModalBody>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    );
}
