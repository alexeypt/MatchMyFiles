'use client';

import React, { useMemo } from 'react';
import {Button } from '@nextui-org/react';

import PageTitle from '@/common/components/PageTitle';
import useModalControl from '@/common/hooks/useModalControl';
import RootFolderCreateModal from '@/root-folder/components/RootFolderCreateModal';


export default function RootFolderListPageHeader() {
    const [isCreateModalOpened, openCreateModal, hideCreateModal] = useModalControl();

    const sideContent = useMemo(() => {
        return (
            <Button
                type="button"
                color="primary"
                size="lg"
                className="w-full sm:w-fit"
                onPress={openCreateModal}
            >
                Create New Root Folder
            </Button>
        );
    }, [openCreateModal]);

    return (
        <header>
            <PageTitle
                title="Root Folders"
                subtitle="Manage the foundational folders you want to scan for duplicate files. A Root Folder is the starting point where Match My Files will analyze all files within, saving details to enable efficient duplicate detection."
                rightSideContent={sideContent}
            />
            <RootFolderCreateModal
                isOpen={isCreateModalOpened}
                onClose={hideCreateModal}
            />
        </header>
    );
}
