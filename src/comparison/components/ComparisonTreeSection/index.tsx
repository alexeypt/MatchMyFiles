"use client";

import React, { useCallback, useMemo, useState } from 'react';
import { StaticTreeDataProvider, Tree, TreeItem, TreeItemIndex, UncontrolledTreeEnvironment } from 'react-complex-tree';

import PageSection from '@/common/components/PageSection';
import { getTreeKey } from '@/common/helpers/treeHelper';
import useModalControl from '@/common/hooks/useModalControl';
import ComparisonItemDetailsModal from '@/comparison/components/ComparisonItemDetailsModal';
import ComparisonTreeItemRow from '@/comparison/components/ComparisonTreeItemRow';
import { ComparisonDetailsModel, ComparisonFileItemModel, ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonTreeSectionProps {
    comparison: ComparisonDetailsModel;
    rootFolderColorMap: Map<number, string>;
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

export default function ComparisonTreeSection({ comparison, rootFolderColorMap }: ComparisonTreeSectionProps) {
    const [isDetailsModalOpened, showDetailsModal, hideDetailsModal] = useModalControl();
    const [selectedItem, setSelectedItem] = useState<ComparisonTreeItem>();

    const dataProvider = useMemo(() => {
        let items = comparison.files.reduce((result, file) => {
            result[getTreeKey(file.id, 'file')] = {
                index: getTreeKey(file.id, 'file'),
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
            result[getTreeKey(folder.id, 'folder')] = {
                index: getTreeKey(folder.id, 'folder'),
                data: {
                    type: ComparisonTreeItemType.Folder,
                    title: folder.name,
                    data: folder
                },
                canMove: false,
                canRename: false,
                isFolder: true,
                children: folder.childFileIds
                    .map(childFileId => getTreeKey(childFileId, 'file'))
                    .concat(folder.childFolderIds.map(childFolderId => getTreeKey(childFolderId, 'folder')))
            };

            return result;
        }, items);

        return new StaticTreeDataProvider(items);
    }, [comparison.files, comparison.folders]);

    const rootItem = comparison.folders.find(folder => !folder.parentFolderId)!;

    const onSelectItem = useCallback((item: ComparisonTreeItem) => {
        setSelectedItem(item);
        showDetailsModal();
    }, [showDetailsModal]);

    const onPrimaryAction = useCallback((item: TreeItem) => {
        setSelectedItem(item.data);
        showDetailsModal();
    }, [showDetailsModal]);

    return (
        <PageSection
            title="Files Tree"
            headingLevel={2}
        >
            <div className="overflow-auto wrap-anywhere">
                <div className="flex flex-col gap-9 min-w-[calc(100%+30px)] w-max -ml-[30px]">
                    <UncontrolledTreeEnvironment<ComparisonTreeItem>
                        dataProvider={dataProvider}
                        getItemTitle={item => item.data.title}
                        canSearch
                        canSearchByStartingTyping
                        renderDepthOffset={40}
                        renderItemTitle={({ item, title }) => {
                            return (
                                <ComparisonTreeItemRow
                                    rootFolderColorMap={rootFolderColorMap}
                                    item={item.data}
                                    title={title}
                                    onSelectItem={onSelectItem}
                                />
                            );
                        }}
                        renderItemsContainer={({ children, containerProps }) =>
                            // react-complex-tree doesn't set role="group" for root tree items container but SiteImprove requires it
                            <ul
                                className="rct-tree-items-container"
                                {...containerProps}
                                role="group"
                            >
                                {children}
                            </ul>
                        }
                        viewState={{}}
                        onPrimaryAction={onPrimaryAction}
                    >
                        <Tree<ComparisonTreeItem>
                            treeId="comparison-results-tree"
                            rootItem={getTreeKey(rootItem.id, 'folder')}
                            treeLabel="Files and Folders Tree"
                        />
                    </UncontrolledTreeEnvironment>
                </div>
            </div>
            <ComparisonItemDetailsModal
                rootFolderColorMap={rootFolderColorMap}
                comparisonId={comparison.id}
                item={selectedItem!}
                isOpen={isDetailsModalOpened}
                onClose={hideDetailsModal}
            />
        </PageSection>
    );
}
