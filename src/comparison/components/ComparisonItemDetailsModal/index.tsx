import React from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import Heading from '@/common/components/Heading';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import ComparisonFolderDetailsModalContent from '@/comparison/components/ComparisonFolderDetailsModalContent';
import { ComparisonTreeItem, ComparisonTreeItemType } from '@/comparison/components/ComparisonTreeSection';
import { ComparisonFileItemModel, ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonItemDetailsModalProps {
    comparisonId: number;
    item: ComparisonTreeItem;
    isOpen: boolean;
    onClose: () => void;
}

export default function ComparisonItemDetailsModal({ item, comparisonId, isOpen, onClose }: ComparisonItemDetailsModalProps) {    
    return (
        <Modal
            isOpen={isOpen}
            size='xl'
            onClose={onClose}
        >
            <ModalContent>
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <Heading level={2}>
                                {item.type === ComparisonTreeItemType.Folder ? 'Folder' : 'File'}: {item.title}
                            </Heading>
                        </ModalHeader>
                        <ModalBody>
                            {item.type === ComparisonTreeItemType.File && (
                                <dl>
                                    <dt>Name:</dt>
                                    <dd>{(item.data as ComparisonFileItemModel).fullName}</dd>

                                    <dt>Size:</dt>
                                    <dd>{getFormattedSize((item.data as ComparisonFileItemModel).size)}</dd>
                                </dl>
                            )}
                            {
                                item.type === ComparisonTreeItemType.Folder && (
                                    <ComparisonFolderDetailsModalContent
                                        item={item.data as ComparisonFolderItemModel}
                                        comparisonId={comparisonId}
                                    />
                                )
                            }
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
