import React from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";

import Heading from '@/common/components/Heading';
import ComparisonFileDetailsModalContent from '@/comparison/components/ComparisonFileDetailsModalContent';
import ComparisonFolderDetailsModalContent from '@/comparison/components/ComparisonFolderDetailsModalContent';
import { ComparisonTreeItem } from '@/comparison/components/ComparisonTreeSection';
import { ComparisonFileItemModel, ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';
import TreeItemType from '@/folder-tree/models/treeItemType';


interface ComparisonItemDetailsModalProps {
    rootFolderColorMap: Map<number, string>;
    comparisonId: number;
    item: ComparisonTreeItem;
    isOpen: boolean;
    onClose: () => void;
}

export default function ComparisonItemDetailsModal({
    rootFolderColorMap,
    item,
    comparisonId,
    isOpen,
    onClose
}: ComparisonItemDetailsModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            size="2xl"
            scrollBehavior="inside"
            classNames={
                {
                    closeButton: 'text-4xl'
                }
            }
            onClose={onClose}
        >
            <ModalContent className="md:p-6">
                {() => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <Heading
                                className="text-3xl font-serif"
                                level={2}
                            >
                                {item.type === TreeItemType.Folder ? 'Folder Details' : 'File Details'}
                            </Heading>
                        </ModalHeader>
                        <ModalBody className="pb-4">
                            {
                                item.type === TreeItemType.Folder && (
                                    <ComparisonFolderDetailsModalContent
                                        rootFolderColorMap={rootFolderColorMap}
                                        item={item.data as ComparisonFolderItemModel}
                                        comparisonId={comparisonId}
                                    />
                                )
                            }
                            {
                                item.type === TreeItemType.File && (
                                    <ComparisonFileDetailsModalContent
                                        rootFolderColorMap={rootFolderColorMap}
                                        item={item.data as ComparisonFileItemModel}
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
