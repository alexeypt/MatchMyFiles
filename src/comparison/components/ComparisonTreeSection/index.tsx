'use client';

import React, { useCallback, useState } from 'react';
import { TreeItem } from 'react-complex-tree';

import PageSection from '@/common/components/PageSection';
import useModalControl from '@/common/hooks/useModalControl';
import ComparisonItemDetailsModal from '@/comparison/components/ComparisonItemDetailsModal';
import ComparisonTreeItemRow from '@/comparison/components/ComparisonTreeItemRow';
import { ComparisonDetailsModel, ComparisonFileItemModel, ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';
import FolderTreeSection from '@/folder-tree/components/FolderTreeSection';
import TreeItemType from '@/folder-tree/models/treeItemType';


interface ComparisonTreeSectionProps {
    comparison: ComparisonDetailsModel;
    rootFolderColorMap: Map<number, string>;
}

export interface ComparisonTreeItem {
    type: TreeItemType;
    title: string;
    data: ComparisonFolderItemModel | ComparisonFileItemModel;
}

export default function ComparisonTreeSection({ comparison, rootFolderColorMap }: ComparisonTreeSectionProps) {
    const [isDetailsModalOpened, showDetailsModal, hideDetailsModal] = useModalControl();
    const [selectedItem, setSelectedItem] = useState<ComparisonTreeItem>();

    const onSelectItem = useCallback((item: ComparisonTreeItem) => {
        setSelectedItem(item);
        showDetailsModal();
    }, [showDetailsModal]);

    const onPrimaryAction = useCallback((item: TreeItem<ComparisonTreeItem>) => {
        setSelectedItem(item.data);
        showDetailsModal();
    }, [showDetailsModal]);

    return (
        <PageSection
            title="Files Tree"
            headingLevel={2}
        >
            <FolderTreeSection<ComparisonFolderItemModel, ComparisonFileItemModel>
                treeId="comparison-results-tree"
                folders={comparison.folders}
                files={comparison.files}
                renderItemTitle={
                    ({ item, title }, searchQuery) => {
                        return (
                            <ComparisonTreeItemRow
                                rootFolderColorMap={rootFolderColorMap}
                                searchQuery={searchQuery}
                                item={item.data}
                                title={title}
                                onSelectItem={onSelectItem}
                            />
                        );
                    }
                }
                onPrimaryAction={onPrimaryAction}
            />
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
