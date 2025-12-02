"use client";

import React, { useCallback, useMemo } from 'react';
import { Link, TableCell } from '@nextui-org/react';

import TextTable, { TextTableColumnConfiguration, TextTableRowConfiguration } from '@/common/components/TextTable';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { pluralize } from '@/common/helpers/pluralizationHelper';
import { getFormattedStringWithWordBreaks } from '@/common/helpers/stringHelper';
import { generateUrl } from '@/common/helpers/urlHelper';
import { RootFolderProcessingStatus } from '@/clients/prisma/client';
import { RootFolderListItemModel } from '@/root-folder/data-access/queries/getRootFoldersQuery';


interface RootFolderTableProps {
    data: RootFolderListItemModel[];
}

interface RootFolderTableItem {
    index: number;
    name: string;
    path: string;
    size: number;
    status: RootFolderProcessingStatus;
    itemsCountText: string;
    filesCount: number;
    foldersCount: number;
    actions: null;
}

const COLUMNS: TextTableColumnConfiguration<RootFolderTableItem>[] = [
    {
        key: "index",
        label: '#'
    },
    {
        key: "name",
        label: "Name",
    },
    {
        key: "path",
        label: "Path",
    },
    {
        key: "size",
        label: "Total Size",
    },
    {
        key: "itemsCountText",
        label: "Items Count",
    },
    {
        key: "actions",
        label: "Actions",
    }
];

export default function RootFolderTable({ data }: RootFolderTableProps) {
    const rows: TextTableRowConfiguration<RootFolderTableItem>[] = useMemo(() => {
        return data.map((item, index) => ({
            key: item.id,
            index: index + 1,
            name: item.name,
            path: item.path,
            size: item.size,
            status: item.status,
            itemsCountText: '',
            filesCount: item.filesCount,
            foldersCount: item.foldersCount,
            actions: null
        }));
    }, [data]);

    const renderCellContent = useCallback((rootFolder: TextTableRowConfiguration<RootFolderTableItem>, columnKey: keyof RootFolderTableItem) => {
        switch (columnKey) {
            case 'size':
                return (
                    <div className="text-base min-w-32 md:min-w-28">
                        {getFormattedSize(rootFolder.size)}
                    </div>
                );
            case 'itemsCountText':
                return (
                    <div className="text-base flex flex-col min-w-32 md:min-w-28">
                        {rootFolder.foldersCount > 0 && <p>{pluralize(rootFolder.foldersCount, 'folder')}</p>}
                        {rootFolder.filesCount > 0 && <p>{pluralize(rootFolder.filesCount, 'file')}</p>}
                    </div>
                );
            case 'actions':
                const editRootFolderUrl = generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: rootFolder.key });

                return (
                    <Link
                        href={editRootFolderUrl}
                        aria-label={`Edit ${rootFolder.name} root folder`}
                        color="primary"
                        underline="hover"
                        className="text-primary-600 min-w-32 md:min-w-fit"
                    >
                        View Details / Edit
                    </Link>
                );
            case 'name':
            case 'path':
                return (
                    <div className="text-base">
                        <span
                            className="text-base min-w-40 md:min-w-fit"
                            dangerouslySetInnerHTML={{
                                __html: getFormattedStringWithWordBreaks(rootFolder[columnKey] as string)
                            }}
                        />
                    </div>
                );
            default:
                return (
                    <span className="text-base min-w-10">
                        {rootFolder[columnKey] as string | number}
                    </span>
                );
        }
    }, []);

    const renderCell = useCallback((rootFolder: TextTableRowConfiguration<RootFolderTableItem>, columnKey: keyof RootFolderTableItem) => {
        const backgroundClassName = rootFolder.status === RootFolderProcessingStatus.Processing
            ? 'bg-yellow-100'
            : rootFolder.status === RootFolderProcessingStatus.Failed
                ? 'bg-red-100'
                : undefined;

        return (
            <TableCell className={backgroundClassName}>
                {renderCellContent(rootFolder, columnKey)}
            </TableCell>
        );
    }, [renderCellContent]);

    return (
        <TextTable<RootFolderTableItem>
            rows={rows}
            columns={COLUMNS}
            renderCell={renderCell}
            ariaLabel="Existing Root Folders"
        />
    );
}
