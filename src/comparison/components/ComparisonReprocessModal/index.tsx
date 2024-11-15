import React, { useCallback, useMemo } from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import Heading from '@/common/components/Heading';
import { action } from '@/common/helpers/actionHelper';
import ComparisonReprocessForm from '@/comparison/components/ComparisonReprocessForm';
import reprocessComparisonRootFolders from '@/comparison/data-access/commands/reprocessComparisonRootFolders';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';
import ComparisonReprocessingFormModel from '@/comparison/models/comparisonReprocessingFormModel';
import { RootFolderNameModel } from '@/root-folder/data-access/queries/getRootFolderNamesQuery';


interface ComparisonReprocessModalProps {
    rootFolders: RootFolderNameModel[];
    comparison: ComparisonDetailsModel;
    isOpen: boolean;
    onClose: () => void;
}

export default function ComparisonReprocessModal({
    rootFolders,
    comparison,
    isOpen,
    onClose
}: ComparisonReprocessModalProps) {
    const router = useRouter();

    const onSubmit = useCallback(async (data: ComparisonReprocessingFormModel) => {
        const [isSuccess] = await action(async () => {
            await reprocessComparisonRootFolders(data.comparisonId, data.rootFolderIdsToReprocess.map(rootFolderId => +rootFolderId));
        }, {
            successText: 'The Comparison processing has been started',
            errorText: 'Failed to start the Comparison processing'
        });

        if (isSuccess) {
            onClose();
            router.refresh();
        }

    }, [onClose, router]);

    const initialFormValues = useMemo(() => {
        return ComparisonReprocessingFormModel.mapFromComparisonModel(comparison);
    }, [comparison]);

    return (
        <Modal
            isOpen={isOpen}
            size='xl'
            onClose={onClose}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <Heading level={2}>
                                Reprocess Root Folders and Comparison
                            </Heading>
                        </ModalHeader>
                        <ModalBody>
                            <ComparisonReprocessForm
                                rootFolders={rootFolders}
                                initialValues={initialFormValues}
                                onSubmit={onSubmit}
                                onClose={onClose}
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
