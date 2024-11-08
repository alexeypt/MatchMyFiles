'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Breadcrumbs, { BreadcrumbItemModel } from '@/common/components/Breadcrumbs';
import ConfirmableButton from '@/common/components/ConfirmableButton';
import PageTitle from '@/common/components/PageTitle';
import { ROOT_FOLDER_ROUTE } from '@/common/constants/routes';
import { action } from '@/common/helpers/actionHelper';
import removeRootFolder from '@/root-folder/data-access/commands/removeRootFolderCommand';
import { RootFolderDetailsModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderDetailsPageHeaderProps {
    rootFolder: RootFolderDetailsModel;
}

export default function RootFolderDetailsPageHeader({ rootFolder }: RootFolderDetailsPageHeaderProps) {
    const router = useRouter();

    const onDelete = useCallback(async () => {
        const [isSuccess] = await action(async () => {
            await removeRootFolder(rootFolder.id);
        }, {
            successText: 'The Root Folder has been successfully removed',
            errorText: 'Failed to remove the Root Folder'
        });

        if (isSuccess) {
            router.push(ROOT_FOLDER_ROUTE);

            router.refresh();
        }
    }, [router, rootFolder.id]);

    const sideContent = useMemo(() => {
        return (
            <ConfirmableButton
                confirmTitle="Delete Root Folder"
                confirmDescription={
                    (
                        <p>
                            <span className="font-bold">{rootFolder.name}</span> Root Folder
                            will be removed without restoring possibilities.
                        </p>
                    )
                }
                confirmYesButtonLabel="Yes, Delete This Root Folder"
                confirmNoButtonLabel="Cancel, Keep This Root Folder"
                type="button"
                color="danger"
                onClick={onDelete}
                size="lg"
            >
                Delete
            </ConfirmableButton>
        );
    }, [onDelete, rootFolder.name]);

    const pageTitle = `Root Folder: ${rootFolder.name}`;

    const breadcrumbs: BreadcrumbItemModel[] = useMemo(() => {
        return [
            {
                href: ROOT_FOLDER_ROUTE,
                title: 'All Root Folders',
                isCurrent: false
            },
            {
                title: pageTitle,
                isCurrent: true
            }
        ];
    }, [pageTitle]);

    return (
        <header className="flex flex-col gap-4">
            <Breadcrumbs items={breadcrumbs} />
            <PageTitle
                title={pageTitle}
                rightSideContent={sideContent}
            />
        </header>
    );
}
