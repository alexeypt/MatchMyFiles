"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { StaticTreeDataProvider, Tree, TreeItem, TreeItemIndex, UncontrolledTreeEnvironment } from 'react-complex-tree';
import { Button } from '@nextui-org/react';

import PageSection from '@/common/components/PageSection';
import useModalControl from '@/common/hooks/useModalControl';
import ComparisonItemDetailsModal from '@/comparison/components/ComparisonItemDetailsModal';
import { ComparisonDetailsModel, ComparisonFileItemModel, ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';
import FolderDuplicationMode from '@/comparison/models/folderDuplicationMode';


interface ComparisonTreeSectionProps {
    comparison: ComparisonDetailsModel;
}

export enum ComparisonTreeItemType {
    Folder,
    File
}

export interface ComparisonTreeItem {
    type: ComparisonTreeItemType;
    title: string;
    data: ComparisonFolderItemModel | ComparisonFileItemModel;
}

export default function ComparisonTreeSection({ comparison }: ComparisonTreeSectionProps) {
    const [isDetailsModalOpened, showDetailsModal, hideDetailsModal] = useModalControl();
    const [selectedItem, setSelectedItem] = useState<ComparisonTreeItem>();

    const dataProvider = useMemo(() => {
        let items = comparison.files.reduce((result, file) => {
            result[`file-${file.id}`] = {
                index: `file-${file.id}`,
                data: {
                    type: ComparisonTreeItemType.File,
                    title: file.fullName,
                    data: file
                },
                canMove: false,
                canRename: false,
                isFolder: false,
                children: []
            };

            return result;
        }, {} as Record<TreeItemIndex, TreeItem<ComparisonTreeItem>>);

        items = comparison.folders.reduce((result, folder) => {
            result[`folder-${folder.id}`] = {
                index: `folder-${folder.id}`,
                data: {
                    type: ComparisonTreeItemType.Folder,
                    title: folder.name,
                    data: folder
                },
                canMove: false,
                canRename: false,
                isFolder: true,
                children: folder.childFileIds.map(childFileId => `file-${childFileId}`).concat(folder.childFolderIds.map(childFolderId => `folder-${childFolderId}`))
            };

            return result;
        }, items);

        return new StaticTreeDataProvider(items);
    }, [comparison.files, comparison.folders]);

    const rootItem = comparison.folders.find(folder => !folder.parentFolderId)!;

    const onSelectItem = useCallback((item: TreeItem<ComparisonTreeItem>) => () => {
        setSelectedItem(item.data);
        showDetailsModal();
    }, [showDetailsModal]);

    return (
        <PageSection
            title="Files Tree"
            headingLevel={2}
        >
            <div className="flex flex-col gap-9">
                <UncontrolledTreeEnvironment<ComparisonTreeItem>
                    dataProvider={dataProvider}
                    getItemTitle={item => item.data.title}
                    canSearch
                    canSearchByStartingTyping
                    renderDepthOffset={40}
                    renderItemTitle={({ item, title }) => {
                        const isFile = item.data.type === ComparisonTreeItemType.File;
                        const isDuplicated = isFile
                            ? (item.data.data as ComparisonFileItemModel).isDuplicated
                            : (item.data.data as ComparisonFolderItemModel).duplicationMode === FolderDuplicationMode.Full;

                        return (
                            <div className={`flex justify-between w-full pt-1 pb-1 pl-2 ${isDuplicated ? 'bg-yellow-200' : ''}`}>
                                <div>
                                    {title}
                                </div>
                                <div>
                                    {isFile && (item.data.data as ComparisonFileItemModel).size}
                                </div>
                                <div>
                                    <Button
                                        size="sm"
                                        color="primary"
                                        radius="none"
                                        aria-label={`View Details for ${item.data.title} item`}
                                        onClick={onSelectItem(item)}
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        );
                    }}
                    viewState={{}}
                >
                    <Tree<ComparisonTreeItem>
                        treeId="tree-3"
                        rootItem={`folder-${rootItem.id}`}
                        treeLabel="Files and Folders Tree"
                    />
                </UncontrolledTreeEnvironment>
            </div>
            <ComparisonItemDetailsModal
                comparisonId={comparison.id}
                item={selectedItem!}
                isOpen={isDetailsModalOpened}
                onClose={hideDetailsModal}
            />
        </PageSection>
    );
}
