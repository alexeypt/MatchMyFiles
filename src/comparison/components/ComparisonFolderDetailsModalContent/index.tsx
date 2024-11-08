import React, { useEffect, useState } from 'react';

import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import getComparisonFolder, { ComparisonFolderDetailsModel } from '@/comparison/data-access/queries/getComparisonFolderQuery';
import { ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonFolderDetailsModalContentProps {
    item: ComparisonFolderItemModel;
    comparisonId: number;
}

export default function ComparisonFolderDetailsModalContent({ item, comparisonId }: ComparisonFolderDetailsModalContentProps) {
    const [folderDetails, setFolderDetails] = useState<ComparisonFolderDetailsModel | null>(null);
    useEffect(() => {
        async function load() {
            setFolderDetails(await getComparisonFolder(comparisonId, item.id));
        }

        load();
    }, [comparisonId, item.id]);

    if (!folderDetails) {
        return null;
    }

    return (
        <dl>
            <div>
                <dt>Name:</dt>
                <dd>{folderDetails.name}</dd>
            </div>
            <div>
                <dt>Absolute path:</dt>
                <dd>{folderDetails.absolutePath}</dd>
            </div>
            <div>
                <dt>Relative path:</dt>
                <dd>{folderDetails.relativePath}</dd>
            </div>
            <div>
                <dt>Size:</dt>
                <dd>{getFormattedSize(folderDetails.size)}</dd>
            </div>
            <div>
                <dt>Files count:</dt>
                <dd>{folderDetails.filesCount}</dd>
            </div>
            <div>
                <dt>Duplicated files count:</dt>
                <dd>{folderDetails.duplicatedFilesCount}</dd>
            </div>
        </dl>
    );
}
