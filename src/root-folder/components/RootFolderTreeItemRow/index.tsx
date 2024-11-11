"use client";

import React, { useCallback } from 'react';
import { Button } from '@nextui-org/react';

import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { RootFolderTreeItem } from '@/root-folder/components/RootFolderTreeSection';


interface RootFolderTreeItemRowProps {
    title: string;
    item: RootFolderTreeItem;
    onSelectItem: (item: RootFolderTreeItem) => void;
}

export default function RootFolderTreeItemRow({ title, item, onSelectItem }: RootFolderTreeItemRowProps) {
    const onSelectItemButtonClicked = useCallback(() => {
        onSelectItem(item);
    }, [item, onSelectItem]);
    
    return (
        <div className={'flex justify-between items-center gap-3 w-full pt-1 pb-1 pl-2'}>
            <div className="flex-grow">
                {title}
            </div>
            <div className="text-base">
                {getFormattedSize(item.data.size)}
            </div>
            <div>
                <Button
                    size="sm"
                    color="primary"
                    radius="none"
                    aria-label={`View Details for ${title} item`}
                    onClick={onSelectItemButtonClicked}
                >
                    View Details
                </Button>
            </div>
        </div>
    );
}
