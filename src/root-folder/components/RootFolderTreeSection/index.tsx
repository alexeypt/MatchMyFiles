"use client";

import React, { useCallback, useMemo, useState } from 'react';
import {TreeItem } from 'react-complex-tree';

import PageSection from '@/common/components/PageSection';
import useModalControl from '@/common/hooks/useModalControl';
import FolderTreeSection from '@/folder-tree/components/FolderTreeSection';
import TreeItemType from '@/folder-tree/models/treeItemType';
import RootFolderItemDetailsModal from '@/root-folder/components/RootFolderItemDetailsModal';
import RootFolderTreeItemRow from '@/root-folder/components/RootFolderTreeItemRow';
import { RootFolderDetailsModel, RootFolderFileItemModel, RootFolderFolderItemModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderTreeSectionProps {
    rootFolder: RootFolderDetailsModel;
}

export interface RootFolderTreeItem {
    type: TreeItemType;
    title: string;
    data: RootFolderFolderItemModel | RootFolderFileItemModel;
}

export default function RootFolderTreeSection({ rootFolder }: RootFolderTreeSectionProps) {
    const [isDetailsModalOpened, showDetailsModal, hideDetailsModal] = useModalControl();
    const [selectedItem, setSelectedItem] = useState<RootFolderTreeItem>();

    const duplicatedFileIds = useMemo(() => {
        return new Set(rootFolder.duplicationData.flatMap(duplicationGroup => duplicationGroup.map(file => file.fileId)));
    }, [rootFolder.duplicationData]);

    const onSelectItem = useCallback((item: RootFolderTreeItem) => {
        setSelectedItem(item);
        showDetailsModal();
    }, [showDetailsModal]);

    const onPrimaryAction = useCallback((item: TreeItem<RootFolderTreeItem>) => {
        setSelectedItem(item.data);
        showDetailsModal();
    }, [showDetailsModal]);

    return (
        <PageSection
            title="Files Tree"
            headingLevel={2}
        >
            <FolderTreeSection<RootFolderFolderItemModel, RootFolderFileItemModel>
                treeId="root-folder-tree"
                folders={rootFolder.folders}
                files={rootFolder.files}
                renderItemTitle={({ item, title }, searchQuery) => {
                    return (
                        <RootFolderTreeItemRow
                            duplicatedFileIds={duplicatedFileIds}
                            item={item.data}
                            title={title}
                            searchQuery={searchQuery}
                            onSelectItem={onSelectItem}
                        />
                    );
                }}
                onPrimaryAction={onPrimaryAction}
            />
            <RootFolderItemDetailsModal
                item={selectedItem!}
                isOpen={isDetailsModalOpened}
                onClose={hideDetailsModal}
            />
        </PageSection>
    );
}
