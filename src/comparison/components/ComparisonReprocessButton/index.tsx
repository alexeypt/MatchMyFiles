'use client';

import React from 'react';
import { Button } from '@nextui-org/react';
import { ComparisonProcessingStatus } from '@prisma/client';

import useModalControl from '@/common/hooks/useModalControl';
import ComparisonReprocessModal from '@/comparison/components/ComparisonReprocessModal';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';
import { RootFolderNameModel } from '@/root-folder/data-access/queries/getRootFolderNamesQuery';


interface ComparisonReprocessButtonProps {
    comparison: ComparisonDetailsModel;
    rootFolders: RootFolderNameModel[];
}

export default function ComparisonReprocessButton({ comparison, rootFolders }: ComparisonReprocessButtonProps) {
    const [isOpen, showModal, hideModal] = useModalControl();

    if (comparison.status !== ComparisonProcessingStatus.Completed) {
        return null;
    }

    return (
        <>
            <Button
                type="button"
                color="success"
                className="bg-green-700 text-white"
                onClick={showModal}
                size="lg"
            >
                Reprocess Root Folders and Comparison
            </Button>
            <ComparisonReprocessModal
                rootFolders={rootFolders}
                comparison={comparison}
                isOpen={isOpen}
                onClose={hideModal}
            />
        </>
    );
}
