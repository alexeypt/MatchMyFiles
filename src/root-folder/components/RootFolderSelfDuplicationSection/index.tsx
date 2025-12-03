'use client';

import React from 'react';

import PageSection from '@/common/components/PageSection';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { RootFolderDuplicatedFileModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderSelfDuplicationSectionProps {
    duplicationData: RootFolderDuplicatedFileModel[][];
}

export default function RootFolderSelfDuplicationSection({ duplicationData }: RootFolderSelfDuplicationSectionProps) {
    return (
        <PageSection
            title="Duplicated Files"
            headingLevel={2}
        >
            <ul className="border-2 divide-y-2">
                {
                    duplicationData.map((duplicationGroup, index) => {
                        const fileSize = duplicationGroup[0]!.size;

                        return (
                            <li
                                key={index}
                                className="p-5 text-lg wrap-anywhere"
                            >
                                <p className="text-xl mb-3">
                                    File Size: <span className="font-bold">{getFormattedSize(fileSize)}</span>
                                </p>
                                <ul className="list-disc ml-8">
                                    {
                                        duplicationGroup.map(duplicatedFile => (
                                            <li key={duplicatedFile.fileId}>
                                                {duplicatedFile.fullName} ({duplicatedFile.absolutePath})
                                            </li>
                                        ))
                                    }
                                </ul>
                            </li>
                        );
                    })
                }
            </ul>
        </PageSection>
    );
}
