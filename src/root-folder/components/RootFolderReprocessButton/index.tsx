'use client';

import React, { useCallback } from 'react';
import { Button } from "@heroui/button";
import { useRouter } from 'next/navigation';

import ConfirmableButton from '@/common/components/ConfirmableButton';
import { action } from '@/common/helpers/actionHelper';
import { pluralize } from '@/common/helpers/pluralizationHelper';
import { RootFolderProcessingStatus } from '@/clients/prisma/browser';
import reprocessRootFolder from '@/root-folder/data-access/commands/reprocessRootFolderCommand';
import { RootFolderDetailsModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderReprocessButtonProps {
    rootFolder: RootFolderDetailsModel;
}

const MIN_FILES_COUNT_TO_SHOW_START_PROCESSING_NOTIFICATION = 100;

export default function RootFolderReprocessButton({ rootFolder }: RootFolderReprocessButtonProps) {
    const router = useRouter();

    const onReprocess = useCallback(async () => {
        const [isSuccess] = await action(async () => {
            await reprocessRootFolder(rootFolder.id);
        }, {
            successText: rootFolder.filesCount > MIN_FILES_COUNT_TO_SHOW_START_PROCESSING_NOTIFICATION
                ? 'The Root Folder reprocessing has been started'
                : undefined,
            errorText: 'Failed to start the Root Folder reprocessing'
        });

        if (isSuccess) {
            router.refresh();
        }
    }, [rootFolder.filesCount, rootFolder.id, router]);

    const onConfirmReprocess = useCallback(async (hideConfirmModal: () => void) => {
        await onReprocess();

        hideConfirmModal();
    }, [onReprocess]);

    if (rootFolder.status !== RootFolderProcessingStatus.Completed) {
        return null;
    }

    if (rootFolder.comparisonsCount === 0) {
        return (
            <Button
                type="button"
                color="success"
                className="w-full sm:w-fit bg-green-700 text-white"
                onPress={onReprocess}
                size="lg"
            >
                Reprocess
            </Button>
        );
    }

    return (
        <ConfirmableButton
            className="w-full sm:w-fit bg-green-700 text-white"
            confirmTitle="Reprocess Root Folder"
            confirmDescription={
                (
                    <p>
                        <span className="font-bold">{rootFolder.name}</span> Root Folder is used
                        in <span className="font-bold">{pluralize(rootFolder.comparisonsCount, 'comparison')}</span>.
                        Reprocessing Root Folder means that all comparisons where this folder is used
                        will be reprocessed as well without possibility to restore previous data.
                    </p>
                )
            }
            confirmYesButtonLabel="Yes, Reprocess This Root Folder"
            confirmNoButtonLabel="Cancel, Keep This Root Folder"
            type="button"
            color="success"
            confirmableYesButtonClassName="bg-green-700 text-white"
            confirmableNoButtonClassName="border-green-700 text-green-700"
            onPress={onConfirmReprocess}
            size="lg"
        >
            Reprocess
        </ConfirmableButton>
    );
}
