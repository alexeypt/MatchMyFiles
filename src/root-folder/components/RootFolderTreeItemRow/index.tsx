"use client";

import React, { useCallback } from 'react';
import { Button } from '@nextui-org/react';
import classNames from 'classnames';

import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { getMarkupWithHighlights } from '@/common/helpers/stringHelper';
import TreeItemType from '@/folder-tree/models/treeItemType';
import { RootFolderTreeItem } from '@/root-folder/components/RootFolderTreeSection';


interface RootFolderTreeItemRowProps {
    duplicatedFileIds: Set<number>;
    title: string;
    searchQuery: string;
    item: RootFolderTreeItem;
    onSelectItem: (item: RootFolderTreeItem) => void;
}

export default function RootFolderTreeItemRow({
    duplicatedFileIds,
    title,
    searchQuery,
    item,
    onSelectItem
}: RootFolderTreeItemRowProps) {
    const onSelectItemButtonClicked = useCallback(() => {
        onSelectItem(item);
    }, [item, onSelectItem]);

    const className = classNames(
        'flex justify-between items-center gap-3 w-full pt-1 pb-1 pl-2',
        { 'bg-green-200': item.type === TreeItemType.File && duplicatedFileIds.has(item.data.id) }
    );

    const titleWithHighlights = searchQuery ? getMarkupWithHighlights(
        title,
        searchQuery,
        'bg-yellow-300'
    ) : title;

    return (
        <span className={className}>
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
