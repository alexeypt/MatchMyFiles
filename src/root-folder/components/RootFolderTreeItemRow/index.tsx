"use client";

import React, { useCallback } from 'react';
import { Button } from '@nextui-org/react';
import classNames from 'classnames';

import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { RootFolderTreeItem, RootFolderTreeItemType } from '@/root-folder/components/RootFolderTreeSection';


interface RootFolderTreeItemRowProps {
    duplicatedFileIds: Set<number>;
    title: string;
    item: RootFolderTreeItem;
    onSelectItem: (item: RootFolderTreeItem) => void;
}

export default function RootFolderTreeItemRow({
    duplicatedFileIds,
    title,
    item,
    onSelectItem
}: RootFolderTreeItemRowProps) {
    const onSelectItemButtonClicked = useCallback(() => {
        onSelectItem(item);
    }, [item, onSelectItem]);

    const className = classNames(
        'flex justify-between items-center gap-3 w-full pt-1 pb-1 pl-2',
        { 'bg-green-200': item.type === RootFolderTreeItemType.File && duplicatedFileIds.has(item.data.id) }
    );
    
    return (
        <span className={className}>
            <span className="flex-grow min-w-32 w-min">
                {title}
            </span>
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
