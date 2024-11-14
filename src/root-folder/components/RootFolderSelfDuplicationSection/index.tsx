"use client";

import React from 'react';

import PageSection from '@/common/components/PageSection';
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
                        return (
                            <li
                                key={index}
                                className="p-3 text-lg wrap-anywhere"
                            >
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
