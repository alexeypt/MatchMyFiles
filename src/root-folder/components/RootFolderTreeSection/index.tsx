"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { StaticTreeDataProvider, Tree, TreeItem, TreeItemIndex, UncontrolledTreeEnvironment } from 'react-complex-tree';

import PageSection from '@/common/components/PageSection';
import { getTreeKey } from '@/common/helpers/treeHelper';
import useModalControl from '@/common/hooks/useModalControl';
import RootFolderItemDetailsModal from '@/root-folder/components/RootFolderItemDetailsModal';
import RootFolderTreeItemRow from '@/root-folder/components/RootFolderTreeItemRow';
import { RootFolderDetailsModel, RootFolderFileItemModel, RootFolderFolderItemModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderTreeSectionProps {
    rootFolder: RootFolderDetailsModel;
}

export enum RootFolderTreeItemType {
    Folder,
    File
}

export interface RootFolderTreeItem {
    type: RootFolderTreeItemType;
    title: string;
    data: RootFolderFolderItemModel | RootFolderFileItemModel;
}

export default function RootFolderTreeSection({ rootFolder }: RootFolderTreeSectionProps) {
    const [isDetailsModalOpened, showDetailsModal, hideDetailsModal] = useModalControl();
    const [selectedItem, setSelectedItem] = useState<RootFolderTreeItem>();

    const dataProvider = useMemo(() => {
        let items = rootFolder.files.reduce((result, file) => {
            result[getTreeKey(file.id, 'file')] = {
                index: getTreeKey(file.id, 'file'),
                data: {
                    type: RootFolderTreeItemType.File,
                    title: file.fullName,
                    data: file
                },
                canMove: false,
                canRename: false,
                isFolder: false,
                children: []
            };

            return result;
        }, {} as Record<TreeItemIndex, TreeItem<RootFolderTreeItem>>);

        items = rootFolder.folders.reduce((result, folder) => {
            result[getTreeKey(folder.id, 'folder')] = {
                index: getTreeKey(folder.id, 'folder'),
                data: {
                    type: RootFolderTreeItemType.Folder,
                    title: folder.name,
                    data: folder
                },
                canMove: false,
                canRename: false,
                isFolder: true,
                children: folder.childFileIds.map(childFileId => getTreeKey(childFileId, 'file'))
                    .concat(folder.childFolderIds.map(childFolderId => getTreeKey(childFolderId, 'folder')))
            };

            return result;
        }, items);

        return new StaticTreeDataProvider(items);
    }, [rootFolder.files, rootFolder.folders]);

    const rootItem = rootFolder.folders.find(folder => !folder.parentFolderId)!;

    const onSelectItem = useCallback((item: RootFolderTreeItem) => {
        setSelectedItem(item);
        showDetailsModal();
    }, [showDetailsModal]);

    return (
        <PageSection
            title="Files Tree"
            headingLevel={2}
        >
            <div className="flex flex-col gap-9">
                <UncontrolledTreeEnvironment
                    dataProvider={dataProvider}
                    getItemTitle={item => item.data.title}
                    canSearch
                    renderDepthOffset={40}
                    renderItemTitle={({ item, title }) => {
                        return (
                            <RootFolderTreeItemRow
                                item={item.data}
                                title={title}
                                onSelectItem={onSelectItem}
                            />
                        );
                    }}
                    canSearchByStartingTyping
                    viewState={{}}
                >
                    <Tree
                        treeId="root-folder-tree"
                        rootItem={getTreeKey(rootItem.id, 'folder')}
                        treeLabel="Files and Folders Tree"
                    />
                </UncontrolledTreeEnvironment>
            </div>
            <RootFolderItemDetailsModal
                item={selectedItem!}
                isOpen={isDetailsModalOpened}
                onClose={hideDetailsModal}
            />
        </PageSection>
    );
}
