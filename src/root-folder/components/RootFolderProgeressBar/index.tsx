"use client";

import React, { useContext, useEffect, useState } from 'react';
import { Progress } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import PageSection from '@/common/components/PageSection';
import RootFoldersStatusContext from '@/common/contexts/rootFoldersStatusContext';
import { RootFolderStatus } from '@/common/models/rootFoldersStatusModel';
import { RootFolderDetailsModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderProgressBarProps {
    rootFolder: RootFolderDetailsModel;
}

export default function RootFolderProgressBar({ rootFolder }: RootFolderProgressBarProps) {
    const router = useRouter();
    const [status, setStatus] = useState<RootFolderStatus | null>(null);
    const rootFoldersStatusModel = useContext(RootFoldersStatusContext);

    useEffect(() => {
        if (rootFoldersStatusModel) {
            setStatus(rootFoldersStatusModel.getRootFolderStatus(rootFolder.id));
            rootFoldersStatusModel.attachEventListener(rootFolder.id, status => {
                if (status) {
                    setStatus(status);
                } else {
                    router.refresh();
                }
            });
        }
    }, [rootFolder.id, rootFoldersStatusModel, router]);

    return (
        <PageSection
            title="Files Processing"
            headingLevel={2}
        >
            <div className="flex flex-col gap-9">
                <Progress
                    aria-label="Processing..."
                    label={status?.message ?? ''}
                    size="md"
                    value={status?.percentStatus ?? 0}
                    color="success"
                    showValueLabel
                    classNames={
                        {
                            track: 'h-6',
                            label: 'text-large',
                            value: 'text-large font-bold'
                        }
                    }
                    className="max-w-md"
                />
            </div>
        </PageSection>
    );
}
