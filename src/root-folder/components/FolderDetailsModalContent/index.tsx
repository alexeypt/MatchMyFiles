import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import KeyValueList from '@/common/components/KeyValueList';
import LoadingSpinner from '@/common/components/LoadingSpinner';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import getFolder, { FolderDetailsModel } from '@/root-folder/data-access/queries/getFolderQuery';
import { RootFolderFolderItemModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface FolderDetailsModalContentProps {
    item: RootFolderFolderItemModel;
}

export default function FolderDetailsModalContent({ item }: FolderDetailsModalContentProps) {
    const [folderDetails, setFolderDetails] = useState<FolderDetailsModel | null>(null);
    useEffect(() => {
        async function load() {
            setFolderDetails(await getFolder(item.id));
        }

        load();
    }, [item.id]);

    const folderDetailsInfo = useMemo(() => {
        if (!folderDetails) {
            return new Map();
        }

        return new Map<string, ReactNode>([
            ['Name', folderDetails.name],
            ['Absolute Path', folderDetails.absolutePath],
            ['Relative Path', folderDetails.relativePath],
            ['Size', getFormattedSize(folderDetails.size)],
            [
                'Created Date',
                (
                    <FormattedDateTime
                        key={+folderDetails.folderCreatedDate}
                        dateTime={folderDetails.folderCreatedDate}
                    />
                )
            ],
            [
                'Modified Date',
                (
                    <FormattedDateTime
                        key={+folderDetails.folderModifiedDate}
                        dateTime={folderDetails.folderModifiedDate}
                    />
                )
            ],
            [
                'Modified Content Date',
                (
                    <FormattedDateTime
                        key={+folderDetails.folderContentModifiedDate}
                        dateTime={folderDetails.folderContentModifiedDate}
                    />
                )
            ]
        ]);
    }, [folderDetails]);

    if (!folderDetails) {
        return (
            <div className="w-full h-40">
                <LoadingSpinner />
            </div>
        );
    }

    return <KeyValueList items={folderDetailsInfo} />;
}
