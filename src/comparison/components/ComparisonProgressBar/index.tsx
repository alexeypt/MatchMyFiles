"use client";

import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Progress } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

import PageSection from '@/common/components/PageSection';
import SocketContext from '@/common/contexts/socketContext';
import ComparisonsStatusModel from '@/common/models/comparisonsStatusModel';
import RootFoldersStatusModel, { RootFolderStatus } from '@/common/models/rootFoldersStatusModel';
import { RootFolderProcessingStatus } from '@/clients/prisma/client';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonProgressBarProps {
    comparison: ComparisonDetailsModel;
}

export default function ComparisonProgressBar({ comparison }: ComparisonProgressBarProps) {
    const router = useRouter();
    const socketContext = useContext(SocketContext);

    const rootFoldersMap = useMemo(() => {
        return new Map([
            comparison.primaryRootFolder,
            ...comparison.rootFolders.map(rootFolder => rootFolder)
        ].map(rootFolder => ([rootFolder.id, rootFolder])));
    }, [comparison.primaryRootFolder, comparison.rootFolders]);

    const [rootFolderStatusMap, setRootFolderStatusMap] = useState<Map<number, RootFolderStatus>>(() => {
        return new Map(Array.from(rootFoldersMap.values()).map(rootFolder => {
            const socketStatus = socketContext?.rootFoldersStatus.getRootFolderStatus(rootFolder.id);
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
        let detachEventListener: ReturnType<RootFoldersStatusModel['attachGenericEventListener']> | null = null;

        if (socketContext) {
            detachEventListener = socketContext.rootFoldersStatus.attachGenericEventListener(status => {
                setRootFolderStatusMap(prevMap => {
                    const newMap = new Map(prevMap);
                    newMap.set(status.rootFolderId, status);

                    return newMap;
                });
            });
        }

        return () => {
            detachEventListener?.();
        };
    }, [socketContext]);

    useEffect(() => {
        let detachEventListener: ReturnType<ComparisonsStatusModel['attachComparisonFinishedEventListener']> | null = null;

        if (socketContext) {
            if (!socketContext.comparisonsStatus.checkIsComparisonProcessing(comparison.id)) {
                // it means that processing was really quick and while this component is being rendered, it has been completed
                router.refresh();
            }

            detachEventListener = socketContext.comparisonsStatus.attachComparisonFinishedEventListener(comparison.id, () => {
                router.refresh();
            });
        }

        return () => {
            detachEventListener?.();
        };
    }, [comparison.id, router, socketContext]);

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
                                className="p-3 text-lg wrap-anywhere flex flex-col gap-5 lg:flex-row lg:gap-20"
                            >
                                <div className="basis-1/2">
                                    <p className="flex gap-x-4 flex-col md:flex-row">
                                        <span className="font-bold shrink-0">Root Folder Name:</span> {rootFolderDetails?.name}
                                    </p>
                                    <p className="flex gap-x-4 flex-col md:flex-row">
                                        <span className="font-bold shrink-0">Root Folder Path:</span> {rootFolderDetails?.path}
                                    </p>
                                </div>
                                <div className="basis-1/2 flex-grow flex-shrink-0">
                                    <div>
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
                                    </div>
                                </div>
                            </li>
                        );
                    }))
                }
            </ul>
        </PageSection>
    );
}
