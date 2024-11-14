import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link } from '@nextui-org/react';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import KeyValueList from '@/common/components/KeyValueList';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { generateUrl } from '@/common/helpers/urlHelper';
import getComparisonFile, { ComparisonFileDetailsModel } from '@/comparison/data-access/queries/getComparisonFileQuery';
import { ComparisonFileItemModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonFileDetailsModalContentProps {
    item: ComparisonFileItemModel;
    comparisonId: number;
}

export default function ComparisonFileDetailsModalContent({ item, comparisonId }: ComparisonFileDetailsModalContentProps) {
    const [fileDetails, setFileDetails] = useState<ComparisonFileDetailsModel | null>(null);
    useEffect(() => {
        async function load() {
            setFileDetails(await getComparisonFile(comparisonId, item.id));
        }

        load();
    }, [comparisonId, item.id]);

    const fileDetailsInfo = useMemo(() => {
        if (!fileDetails) {
            return new Map();
        }
        return new Map<string, ReactNode>([
            ['Name', fileDetails.name],
            ['Extension', fileDetails.extension],
            ['Absolute Path', fileDetails.absolutePath],
            ['Relative Path', fileDetails.relativePath],
            ['Relative Path', fileDetails.relativePath],
            ['Size', getFormattedSize(fileDetails.size)],
            ['Latitude', fileDetails.latitude],
            ['Longitude', fileDetails.longitude],
            ['Created Date', (
                <FormattedDateTime
                    key={+fileDetails.fileCreatedDate}
                    dateTime={fileDetails.fileCreatedDate}
                />
            )],
            ['Modified Date', (
                <FormattedDateTime
                    key={+fileDetails.fileModifiedDate}
                    dateTime={fileDetails.fileModifiedDate}
                />
            )],
            ['Modified Content Date', (
                <FormattedDateTime
                    key={+fileDetails.fileContentModifiedDate}
                    dateTime={fileDetails.fileContentModifiedDate}
                />
            )],
            ['Is Duplicated', fileDetails.isDuplicated
                ? <span className="text-green-800">Yes</span>
                : <span className="text-red-800">No</span>
            ]
        ]);
    }, [fileDetails]);

    if (!fileDetails) {
        return null;
    }

    return (
        <div>
            <KeyValueList
                items={fileDetailsInfo}
                skipNullableValues
            />
            {
                fileDetails.duplicationInfo.length > 0 && (
                    <section className="font-serif mt-6 flex flex-col gap-3">
                        <h3 className="text-2xl text-blue-950">
                            Duplicated with:
                        </h3>
                        <ul className="border-2 divide-y-2">
                            {fileDetails.duplicationInfo.map(item => (
                                <li
                                    key={item.fileId}
                                    className="p-3 text-lg"
                                >
                                    <p className="flex gap-4">
                                        <span className="font-bold">Root Folder Name:</span>
                                        {' '}
                                        <Link
                                            href={generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: item.rootFolderId })}
                                            className="text-lg"
                                        >
                                            {item.rootFolderName}
                                        </Link>
                                    </p>
                                    <p className="flex gap-4">
                                        <span className="font-bold">Root Folder Path:</span> {item.rootFolderPath}
                                    </p>
                                    <p className="flex gap-4">
                                        <span className="font-bold">File Name:</span> {item.fullName}
                                    </p>
                                    <p className="flex gap-4">
                                        <span className="font-bold">File Path:</span> {item.absolutePath}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    </section>
                )
            }
        </div>
    );
}
