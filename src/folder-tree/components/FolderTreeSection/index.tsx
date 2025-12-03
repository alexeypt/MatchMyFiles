'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ControlledTreeEnvironment, Tree, TreeItem, TreeItemIndex } from 'react-complex-tree';
import { Button } from '@heroui/button';

import { pluralize } from '@/common/helpers/pluralizationHelper';
import { getTreeKey } from '@/common/helpers/treeHelper';
import FolderTreeSettingsForm from '@/folder-tree/components/FolderTreeSettingsForm';
import useTreeItems from '@/folder-tree/hooks/useTreeItems';
import FileItemModel from '@/folder-tree/models/fileItemModel';
import FolderItemModel from '@/folder-tree/models/folderItemModel';
import FolderTreeOrdering from '@/folder-tree/models/folderTreeOrdering';
import TreeItemData from '@/folder-tree/models/treeItemData';


interface FolderTreeSectionProps<TFolder extends FolderItemModel, TFile extends FileItemModel> {
    treeId: string;
    files: TFile[];
    folders: TFolder[];
    onPrimaryAction: (item: TreeItem<TreeItemData<TFolder, TFile>>) => void;
    renderItemTitle: (
        props: {
            title: string;
            item: TreeItem<TreeItemData<TFolder, TFile>>;
        },
        searchQuery: string
    ) => React.ReactElement<unknown> | null | string;
}

export default function FolderTreeSection<TFolder extends FolderItemModel, TFile extends FileItemModel>({
    treeId,
    files,
    folders,
    onPrimaryAction,
    renderItemTitle
}: FolderTreeSectionProps<TFolder, TFile>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [ordering, setOrdering] = useState(FolderTreeOrdering.ByName);

    const onUpdateOrdering = useCallback((newValue: FolderTreeOrdering) => {
        setOrdering(newValue);
    }, []);

    const onUpdateSearchQuery = useCallback((newValue: string) => {
        setSearchQuery(newValue);
    }, []);

    const treeItems = useTreeItems(files, folders, searchQuery, ordering);
    const treeItemsCount = useMemo(() => {
        return Object.values(treeItems).length;
    }, [treeItems]);
    const hasItems = treeItemsCount > 1;

    const rootItem = useMemo(
        () => folders.find(folder => !folder.parentFolderId)!,
        [folders]
    );

    const [focusedItem, setFocusedItem] = useState<TreeItemIndex>();
    const [expandedItems, setExpandedItems] = useState<TreeItemIndex[]>([]);
    const [selectedItems, setSelectedItems] = useState<TreeItemIndex[]>([]);

    const viewState = useMemo(() => {
        return {
            [treeId]: {
                focusedItem,
                expandedItems,
                selectedItems
            }
        };
    }, [expandedItems, focusedItem, selectedItems, treeId]);

    const onFocusItem = useCallback((item: TreeItem<TreeItemData<TFolder, TFile>>) => {
        setFocusedItem(item.index);
    }, []);

    const onExpandItem = useCallback((item: TreeItem<TreeItemData<TFolder, TFile>>) => {
        setExpandedItems([...expandedItems, item.index]);
    }, [expandedItems]);

    const onCollapseItem = useCallback((item: TreeItem<TreeItemData<TFolder, TFile>>) => {
        setExpandedItems(expandedItems.filter(expandedItemIndex => expandedItemIndex !== item.index));
    }, [expandedItems]);

    const onSelectItems = useCallback((items: TreeItemIndex[]) => {
        setSelectedItems(items);
    }, []);

    const onExpandAll = useCallback(() => {
        setExpandedItems(Object.values(treeItems).map(item => item.index));
    }, [treeItems]);

    const onCollapseAll = useCallback(() => {
        setExpandedItems([]);
    }, []);

    useEffect(() => {
        if (searchQuery && treeItemsCount < 100) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            onExpandAll();
        }
    }, [onExpandAll, searchQuery, treeItemsCount]);

    const renderTreeItemTitle = useCallback((props: {
        title: string;
        item: TreeItem<TreeItemData<TFolder, TFile>>;
    }) => {
        return renderItemTitle(props, searchQuery);
    }, [renderItemTitle, searchQuery]);

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
                <FolderTreeSettingsForm
                    ordering={ordering}
                    onUpdateOrdering={onUpdateOrdering}
                    onUpdateSearchQuery={onUpdateSearchQuery}
                />
                {
                    hasItems && (
                        <div className="flex flex-col sm:flex-row gap-5 justify-end">
                            <Button
                                type="button"
                                color="primary"
                                size="lg"
                                className="w-full sm:w-fit"
                                isDisabled={expandedItems.length === treeItemsCount}
                                onPress={onExpandAll}
                            >
                                Expand All Items ({pluralize(treeItemsCount, 'item', 'items')})
                            </Button>
                            <Button
                                type="button"
                                size="lg"
                                className="w-full sm:w-fit bg-green-700 text-white"
                                isDisabled={expandedItems.length === 0}
                                onPress={onCollapseAll}
                            >
                                Collapse All Items
                            </Button>
                        </div>
                    )
                }
            </div>
            <div className="overflow-auto wrap-anywhere">
                <div className="flex flex-col gap-9 min-w-[calc(100%+30px)] w-max -ml-[30px]">
                    <ControlledTreeEnvironment
                        items={treeItems}
                        getItemTitle={item => item.data.title}
                        renderDepthOffset={40}
                        renderItemTitle={renderTreeItemTitle}
                        renderItemsContainer={
                            ({ children, containerProps }) => (
                            // react-complex-tree doesn't set role="group" for root tree items container but SiteImprove requires it
                                <ul
                                    className="rct-tree-items-container"
                                    {...containerProps}
                                    role="group"
                                >
                                    {children}
                                </ul>
                            )
                        }
                        viewState={viewState}
                        onPrimaryAction={onPrimaryAction}
                        onFocusItem={onFocusItem}
                        onExpandItem={onExpandItem}
                        onCollapseItem={onCollapseItem}
                        onSelectItems={onSelectItems}
                    >
                        <Tree
                            treeId={treeId}
                            rootItem={getTreeKey(rootItem.id, 'folder')}
                            treeLabel="Files and Folders Tree"
                        />
                    </ControlledTreeEnvironment>
                </div>
                {!hasItems && <div className="border-1 border-gray-300 p-7 text-lg">No tree items to display</div>}
            </div>
        </div>
    );
}
