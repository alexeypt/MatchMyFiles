import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import KeyValueList from '@/common/components/KeyValueList';
import LoadingSpinner from '@/common/components/LoadingSpinner';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import getFile, { FileDetailsModel } from '@/root-folder/data-access/queries/getFileQuery';
import { RootFolderFileItemModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface FileDetailsModalContentProps {
    item: RootFolderFileItemModel;
}

export default function FileDetailsModalContent({ item }: FileDetailsModalContentProps) {
    const [fileDetails, setFileDetails] = useState<FileDetailsModel | null>(null);
    useEffect(() => {
        async function load() {
            setFileDetails(await getFile(item.id));
        }

        load();
    }, [item.id]);

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
            [
                'Created Date',
                (
                    <FormattedDateTime
                        key={+fileDetails.fileCreatedDate}
                        dateTime={fileDetails.fileCreatedDate}
                    />
                )
            ],
            [
                'Modified Date',
                (
                    <FormattedDateTime
                        key={+fileDetails.fileModifiedDate}
                        dateTime={fileDetails.fileModifiedDate}
                    />
                )
            ],
            [
                'Modified Content Date',
                (
                    <FormattedDateTime
                        key={+fileDetails.fileContentModifiedDate}
                        dateTime={fileDetails.fileContentModifiedDate}
                    />
                )
            ]
        ]);
    }, [fileDetails]);

    if (!fileDetails) {
        return (
            <div className="w-full h-40">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <KeyValueList
            items={fileDetailsInfo}
            skipNullableValues
        />
    );
}
