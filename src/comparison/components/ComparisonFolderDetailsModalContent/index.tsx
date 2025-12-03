import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link } from '@heroui/link';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import KeyValueList from '@/common/components/KeyValueList';
import LoadingSpinner from '@/common/components/LoadingSpinner';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { convertHexToRgbaColor } from '@/common/helpers/colorHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { roundNumber } from '@/common/helpers/numberHelper';
import { generateUrl } from '@/common/helpers/urlHelper';
import getComparisonFolder, { ComparisonFolderDetailsModel } from '@/comparison/data-access/queries/getComparisonFolderQuery';
import { ComparisonFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';
import FolderDuplicationMode from '@/comparison/models/folderDuplicationMode';


interface ComparisonFolderDetailsModalContentProps {
    rootFolderColorMap: Map<number, string>;
    item: ComparisonFolderItemModel;
    comparisonId: number;
}

export default function ComparisonFolderDetailsModalContent({ item, comparisonId, rootFolderColorMap }: ComparisonFolderDetailsModalContentProps) {
    const [folderDetails, setFolderDetails] = useState<ComparisonFolderDetailsModel | null>(null);
    useEffect(() => {
        async function load() {
            setFolderDetails(await getComparisonFolder(comparisonId, item.id));
        }

        load();
    }, [comparisonId, item.id]);

    const folderDetailsInfo = useMemo(() => {
        if (!folderDetails) {
            return new Map();
        }

        return new Map<string, ReactNode>([
            ['Name', folderDetails.name],
            ['Absolute Path', folderDetails.absolutePath],
            ['Relative Path', folderDetails.relativePath],
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
            ],
            ['Total Files Count', folderDetails.filesCount],
            [
                'Duplicated Files Count',
                folderDetails.filesCount > 0
                    ? `${folderDetails.duplicatedFilesCount} (${roundNumber(folderDetails.duplicatedFilesCount / folderDetails.filesCount * 100.0, 1)}%)`
                    : '0 (0%)'
            ],
            ['Total Size', getFormattedSize(folderDetails.size)],
            [
                'Duplicated Size',
                folderDetails.size > 0
                    ? `${getFormattedSize(folderDetails.duplicatedFilesSize)} (${roundNumber(folderDetails.duplicatedFilesSize / folderDetails.size * 100.0, 1)}%)`
                    : `${getFormattedSize(folderDetails.duplicatedFilesSize)} (0%)`
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

    return (
        <div className="wrap-anywhere">
            <KeyValueList items={folderDetailsInfo} />
            {
                folderDetails.duplicationInfo.length > 0 && (
                    <section className="font-serif md:mt-6 flex flex-col gap-3">
                        <h3 className="text-2xl text-blue-950">
                            Has Duplicates with:
                        </h3>
                        <ul className="border-2 divide-y-2">
                            {
                                folderDetails.duplicationInfo.map(duplicationItem => {
                                    const folderDuplicationMode = item.duplicationInfo
                                        .find(info => info.rootFolderId === duplicationItem.rootFolderId)?.duplicationMode;

                                    const backgroundColor = folderDuplicationMode === FolderDuplicationMode.Partial
                                        ? convertHexToRgbaColor(rootFolderColorMap.get(duplicationItem.rootFolderId)!, 0.5)
                                        : rootFolderColorMap.get(duplicationItem.rootFolderId);

                                    return (
                                        <li
                                            key={duplicationItem.rootFolderId}
                                            className="p-3 text-lg bg-(--duplicated-color) flex flex-col gap-2 md:gap-1"
                                            style={
                                                {
                                                    '--duplicated-color': backgroundColor
                                                }
                                            }
                                        >
                                            <p className="flex gap-x-4 flex-col md:flex-row">
                                                <span className="font-bold shrink-0">Status:</span>
                                                {
                                                    folderDuplicationMode === FolderDuplicationMode.Full
                                                        ? 'Totally Duplicated'
                                                        : 'Partially Duplicated'
                                                }
                                            </p>
                                            <p className="flex gap-x-4 flex-col md:flex-row">
                                                <span className="font-bold shrink-0">Root Folder Name:</span>
                                                {' '}
                                                <Link
                                                    href={generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: duplicationItem.rootFolderId })}
                                                    className="text-lg"
                                                >
                                                    {duplicationItem.rootFolderName}
                                                </Link>
                                            </p>
                                            <p className="flex gap-x-4 flex-col md:flex-row">
                                                <span className="font-bold shrink-0">Root Folder Path:</span> {duplicationItem.rootFolderPath}
                                            </p>
                                            <p className="flex gap-x-4 flex-col md:flex-row">
                                                <span className="font-bold shrink-0">Duplicated Files Count:</span> {duplicationItem.duplicatedFilesCount}
                                            </p>
                                            <p className="flex gap-x-4 flex-col md:flex-row">
                                                <span className="font-bold ">Duplicated Files Size:</span> {getFormattedSize(duplicationItem.duplicatedFilesSize)}
                                            </p>
                                        </li>
                                    );
                                })
                            }
                        </ul>
                    </section>
                )
            }
        </div>
    );
}
