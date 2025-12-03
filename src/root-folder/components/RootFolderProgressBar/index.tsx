'use client';

import React, { useContext, useEffect, useState } from 'react';
import { Progress } from '@heroui/progress';
import { useRouter } from 'next/navigation';

import PageSection from '@/common/components/PageSection';
import SocketContext from '@/common/contexts/socketContext';
import RootFoldersStatusModel, { RootFolderStatus } from '@/common/models/rootFoldersStatusModel';
import { RootFolderDetailsModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderProgressBarProps {
    rootFolder: RootFolderDetailsModel;
}

export default function RootFolderProgressBar({ rootFolder }: RootFolderProgressBarProps) {
    const router = useRouter();
    const [status, setStatus] = useState<RootFolderStatus | null>(null);
    const socketContext = useContext(SocketContext);

    useEffect(() => {
        let detachEventListener: ReturnType<RootFoldersStatusModel['attachEventListener']> | null = null;

        if (socketContext) {
            const currentStatus = socketContext.rootFoldersStatus.getRootFolderStatus(rootFolder.id);

            if (currentStatus?.isFinished) {
                // it means that processing was really quick and while this component is being rendered, it has been completed
                router.refresh();
            }

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setStatus(currentStatus);
            detachEventListener = socketContext.rootFoldersStatus.attachEventListener(rootFolder.id, status => {
                setStatus(status);

                if (status.isFinished) {
                    router.refresh();
                }
            });
        }

        return () => {
            detachEventListener?.();
        };
    }, [rootFolder.id, socketContext, router]);

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
        </PageSection>
    );
}
