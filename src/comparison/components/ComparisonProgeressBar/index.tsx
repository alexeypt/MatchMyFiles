"use client";

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Progress } from '@nextui-org/react';
import { RootFolderProcessingStatus } from '@prisma/client';
import { useRouter } from 'next/navigation';

import PageSection from '@/common/components/PageSection';
import RootFoldersStatusContext from '@/common/contexts/rootFoldersStatusContext';
import RootFoldersStatusModel, { RootFolderStatus } from '@/common/models/rootFoldersStatusModel';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonProgressBarProps {
    comparison: ComparisonDetailsModel;
}

export default function ComparisonProgressBar({ comparison }: ComparisonProgressBarProps) {
    const router = useRouter();
    const rootFoldersStatusModel = useContext(RootFoldersStatusContext);

    const rootFoldersMap = useMemo(() => {
        return new Map([
            comparison.primaryRootFolder,
            ...comparison.rootFolders.map(rootFolder => rootFolder)
        ].map(rootFolder => ([rootFolder.id, rootFolder])));
    }, [comparison.primaryRootFolder, comparison.rootFolders]);

    const [rootFolderStatusMap, setRootFolderStatusMap] = useState<Map<number, RootFolderStatus>>(() => {
        return new Map(Array.from(rootFoldersMap.values()).map(rootFolder => {
            const socketStatus = rootFoldersStatusModel?.getRootFolderStatus(rootFolder.id);
            const dbStatus = rootFolder.status;

            if (dbStatus !== RootFolderProcessingStatus.Processing) {
                return [rootFolder.id, {
                    rootFolderId: rootFolder.id,
                    percentStatus: 100,
                    message: 'Completed',
                    isFailed: false,
                    isFinished: true
                }];
            }

            if (!socketStatus) {
                return [rootFolder.id, {
                    rootFolderId: rootFolder.id,
                    percentStatus: 0,
                    message: 'Not Started',
                    isFailed: false,
                    isFinished: false
                }];
            }

            return [rootFolder.id, socketStatus];
        }));
    });

    useEffect(() => {
        const isCompleted = Array.from(rootFolderStatusMap.values()).every(rootFolderStatus => rootFolderStatus.isFinished);

        if (isCompleted) {
            router.refresh();
        }
    }, [rootFolderStatusMap, router]);

    useEffect(() => {
        let detachEventListener: ReturnType<RootFoldersStatusModel['attachGenericEventListener']> | null = null;

        if (rootFoldersStatusModel) {
            detachEventListener = rootFoldersStatusModel.attachGenericEventListener(status => {
                if (status) {
                    setRootFolderStatusMap(prevMap => {
                        const newMap = new Map(prevMap);
                        newMap.set(status.rootFolderId, status);

                        return newMap;
                    });
                }
            });
        }

        return () => {
            detachEventListener?.();
        };
    }, [rootFoldersStatusModel]);

    return (
        <PageSection
            title="Root Folders Processing"
            headingLevel={2}
        >
            <ul className="border-2 divide-y-2">
                {
                    Array.from(rootFolderStatusMap.values()).map((rootFolderStatus => {
                        const rootFolderDetails = rootFoldersMap.get(rootFolderStatus.rootFolderId);

                        return (
                            <li
                                key={rootFolderStatus.rootFolderId}
                                className="p-3 text-lg wrap-anywhere flex gap-20"
                            >
                                <div className="basis-1/2">
                                    <p className="flex gap-4">
                                        <span className="font-bold shrink-0">Root Folder Name:</span> {rootFolderDetails?.name}
                                    </p>
                                    <p className="flex gap-4">
                                        <span className="font-bold shrink-0">Root Folder Path:</span> {rootFolderDetails?.path}
                                    </p>
                                </div>
                                <div className="basis-1/2 flex-grow flex-shrink-0">
                                    <p>
                                        <Progress
                                            aria-label="Processing..."
                                            label={rootFolderStatus.message ?? ''}
                                            size="md"
                                            value={rootFolderStatus.percentStatus}
                                            color="success"
                                            classNames={
                                                {
                                                    track: 'h-6',
                                                    label: 'text-large',
                                                    value: 'text-large font-bold'
                                                }
                                            }
                                            className="max-w-md"
                                            showValueLabel
                                            disableAnimation
                                        />
                                    </p>
                                </div>
                            </li>
                        );
                    }))
                }
            </ul>
        </PageSection>
    );
}
