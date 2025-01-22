import React from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';

import Heading from '@/common/components/Heading';
import TreeItemType from '@/folder-tree/models/treeItemType';
import FileDetailsModalContent from '@/root-folder/components/FileDetailsModalContent';
import FolderDetailsModalContent from '@/root-folder/components/FolderDetailsModalContent';
import { RootFolderTreeItem } from '@/root-folder/components/RootFolderTreeSection';
import { RootFolderFileItemModel, RootFolderFolderItemModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderItemDetailsModalProps {
    item: RootFolderTreeItem;
    isOpen: boolean;
    onClose: () => void;
}

export default function RootFolderItemDetailsModal({ item, isOpen, onClose }: RootFolderItemDetailsModalProps) {
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
                                    <FolderDetailsModalContent item={item.data as RootFolderFolderItemModel} />
                                )
                            }
                            {
                                item.type === TreeItemType.File && (
                                    <FileDetailsModalContent item={item.data as RootFolderFileItemModel} />
                                )
                            }
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
