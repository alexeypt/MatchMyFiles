"use client";

import React, { useCallback, useMemo } from 'react';
import { Button } from '@nextui-org/react';

import { convertHexToRgbaColor } from '@/common/helpers/colorHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { getMarkupWithHighlights } from '@/common/helpers/stringHelper';
import { ComparisonTreeItem } from '@/comparison/components/ComparisonTreeSection';
import { ComparisonFileItemModel, ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';
import FolderDuplicationMode from '@/comparison/models/folderDuplicationMode';
import TreeItemType from '@/folder-tree/models/treeItemType';


interface ComparisonTreeItemRowProps {
    rootFolderColorMap: Map<number, string>;
    title: string;
    searchQuery: string;
    item: ComparisonTreeItem;
    onSelectItem: (item: ComparisonTreeItem) => void;
}

const ACTIVE_FOLDER_DUPLICATION_MODES = new Set([
    FolderDuplicationMode.Partial,
    FolderDuplicationMode.Full
]);

export default function ComparisonTreeItemRow({
    rootFolderColorMap,
    title,
    searchQuery,
    item,
    onSelectItem
}: ComparisonTreeItemRowProps) {
    const onSelectItemButtonClicked = useCallback(() => {
        onSelectItem(item);
    }, [item, onSelectItem]);

    const background = useMemo(() => {
        if (item.type === TreeItemType.File) {
            const duplicatedRootFoldersSet = new Set((item.data as ComparisonFileItemModel).duplicatedRootFolderIds);
            const gradientExpression = Array.from(rootFolderColorMap.entries())
                .filter(([rootFolderId]) => duplicatedRootFoldersSet.has(rootFolderId))
                .map(([_, color], index, { length }) => {
                    return `${color} ${index * 100.0 / length}% ${(index + 1) * 100.0 / length}%`;
                })
                .join(',');

            return `linear-gradient(to right, ${gradientExpression})`;
        }

        const duplicatedRootFoldersMap = new Map(
            (item.data as ComparisonFolderItemModel).duplicationInfo.map(info => ([info.rootFolderId, info.duplicationMode]))
        );
        const gradientExpression = Array.from(rootFolderColorMap.entries())
            .filter(([rootFolderId]) => ACTIVE_FOLDER_DUPLICATION_MODES.has(duplicatedRootFoldersMap.get(rootFolderId)!))
            .map(([rootFolderId, color], index, { length }) => {
                const duplicationMode = duplicatedRootFoldersMap.get(rootFolderId)!;
                const resultColor = duplicationMode === FolderDuplicationMode.Full
                    ? color
                    : convertHexToRgbaColor(color, 0.5);

                return `${resultColor} ${index * 100.0 / length}% ${(index + 1) * 100.0 / length}%`;
            })
            .join(',');

        return `linear-gradient(to right, ${gradientExpression})`;
    }, [item.data, item.type, rootFolderColorMap]);

    const titleWithHighlights = searchQuery ? getMarkupWithHighlights(
        title,
        searchQuery,
        'bg-yellow-300'
    ) : title;

    return (
        <span
            className="flex justify-between items-center gap-3 w-full pt-1 pb-1 pl-2"
            style={{ background: background }}
        >
            <span
                className="flex-grow min-w-32 w-min"
                dangerouslySetInnerHTML={
                    {
                        __html: titleWithHighlights
                    }
                }
            />
            <span className="text-base shrink-0">
                {getFormattedSize(item.data.size)}
            </span>
            <span className="pr-2">
                <Button
                    size="sm"
                    color="primary"
                    radius="none"
                    aria-label={`View Details for ${title} item`}
                    as="span"
                    excludeFromTabOrder
                    onPress={onSelectItemButtonClicked}
                >
                    View Details
                </Button>
            </span>
        </span>
    );
}
