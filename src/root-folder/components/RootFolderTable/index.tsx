"use client";

import React, { useCallback, useMemo } from 'react';
import { Link, TableCell } from '@nextui-org/react';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import TextTable, { TextTableColumnConfiguration, TextTableRowConfiguration } from '@/common/components/TextTable';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { generateUrl } from '@/common/helpers/urlHelper';
import { RootFolderListItemModel } from '@/root-folder/data-access/queries/getRootFoldersQuery';


interface RootFolderTableProps {
    data: RootFolderListItemModel[];
}

interface RootFolderTableItem {
    index: number;
    name: string;
    path: string;
    filesCount: number;
    foldersCount: number;
    createdAt: Date;
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
        key: "filesCount",
        label: "Files Count",
    },
    {
        key: "foldersCount",
        label: "Folders Count",
    },
    {
        key: "createdAt",
        label: "Create Date",
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
            createdAt: item.createdAt,
            filesCount: item.filesCount,
            foldersCount: item.foldersCount,
            actions: null
        }));
    }, [data]);

    const renderCellContent = useCallback((rootFolder: TextTableRowConfiguration<RootFolderTableItem>, columnKey: keyof RootFolderTableItem) => {
        switch (columnKey) {
            case 'createdAt':
                return (
                    <div className="text-base">
                        <FormattedDateTime dateTime={rootFolder.createdAt} />
                    </div>
                );
            case "actions":
                const editRootFolderUrl = generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: rootFolder.key });

                return (
                    <Link
                        href={editRootFolderUrl}
                        aria-label={`Edit ${rootFolder.name} root folder`}
                        color="primary"
                        underline="hover"
                        className="text-primary-600"
                    >
                        View Details / Edit
                    </Link>
                );
            default:
                return (
                    <span className="text-base">
                        {rootFolder[columnKey] as string | number}
                    </span>
                );
        }
    }, []);

    const renderCell = useCallback((rootFolder: TextTableRowConfiguration<RootFolderTableItem>, columnKey: keyof RootFolderTableItem) => {
        return (
            <TableCell>
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
