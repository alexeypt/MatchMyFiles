"use client";

import React, { useCallback, useMemo } from 'react';
import { Link, TableCell } from '@nextui-org/react';

import TextTable, { TextTableColumnConfiguration, TextTableRowConfiguration } from '@/common/components/TextTable';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { generateUrl } from '@/common/helpers/urlHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { ComparisonRootFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';
import { roundNumber } from '@/common/helpers/numberHelper';


interface ComparisonRootFolderTableProps {
    data: ComparisonRootFolderItemModel[];
}

interface ComparisonRootFolderTableItem {
    isPrimary: boolean;
    index: number;
    name: string;
    path: string;
    size: number;
    totalFilesCount: number;
    duplicatedFilesCount: number;
    duplicatedFilesCountPercent: number;
    duplicatedFilesSize: number;
    duplicatedFilesSizePercent: number;
    duplicatedColor: null;
    partiallyDuplicatedColor: null;
}

const COLUMNS: TextTableColumnConfiguration<ComparisonRootFolderTableItem>[] = [
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
        key: "duplicatedFilesCount",
        label: "Duplicated Files Count",
    },
    {
        key: "duplicatedFilesSize",
        label: "Duplicated Files Size",
    },
    {
        key: "duplicatedColor",
        label: "Duplicated color",
    },
    {
        key: "partiallyDuplicatedColor",
        label: "Partially Duplicated color",
    },
];

export default function ComparisonRootFolderTable({ data }: ComparisonRootFolderTableProps) {
    const rows: TextTableRowConfiguration<ComparisonRootFolderTableItem>[] = useMemo(() => {
        return data.map((item, index) => ({
            key: item.id,
            index: index + 1,
            isPrimary: item.isPrimary,
            name: item.name,
            path: item.path,
            size: item.size,
            totalFilesCount: item.totalFilesCount,
            duplicatedFilesCount: item.duplicatedFilesCount,
            duplicatedFilesCountPercent: item.totalFilesCount > 0
                ? roundNumber(item.duplicatedFilesCount / item.totalFilesCount * 100.0, 1)
                : 0,
            duplicatedFilesSize: item.duplicatedFilesSize,
            duplicatedFilesSizePercent: roundNumber(item.duplicatedFilesSize / item.size * 100.0, 1),
            duplicatedColor: null,
            partiallyDuplicatedColor: null
        }));
    }, [data]);

    const renderCellContent = useCallback((rootFolder: TextTableRowConfiguration<ComparisonRootFolderTableItem>, columnKey: keyof ComparisonRootFolderTableItem) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div className="text-base">
                        <Link
                            href={generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: rootFolder.key })}
                            underline="hover"
                        >
                            <span className="font-bold">{rootFolder.name}&nbsp;</span>
                        </Link>
                    </div>
                );
            case 'duplicatedFilesCount':
                return (
                    <div className={`text-base ${rootFolder.duplicatedFilesCount > 0 && !rootFolder.isPrimary ? 'bg-yellow-200' : ''}`}>
                        {rootFolder.duplicatedFilesCount} / {rootFolder.totalFilesCount}
                        {' '}
                        ({rootFolder.duplicatedFilesCountPercent}%)
                    </div>
                );
            case 'duplicatedFilesSize':
                return (
                    <div className={`text-base ${rootFolder.duplicatedFilesSize > 0 && !rootFolder.isPrimary ? 'bg-yellow-200' : ''}`}>
                        {getFormattedSize(rootFolder.duplicatedFilesSize)} / {getFormattedSize(rootFolder.size)}
                        {' '}
                        ({rootFolder.duplicatedFilesSizePercent}%)
                    </div>
                );
            case 'duplicatedColor':
                return (
                    <div className="text-base">

                    </div>
                );
            case 'partiallyDuplicatedColor':
                return (
                    <div className="text-base">

                    </div>
                );
            default:
                return (
                    <span className="text-base">
                        {rootFolder[columnKey] as string | number}
                    </span>
                );
        }
    }, []);

    const renderCell = useCallback((comparison: TextTableRowConfiguration<ComparisonRootFolderTableItem>, columnKey: keyof ComparisonRootFolderTableItem) => {
        return (
            <TableCell className={comparison.isPrimary ? 'bg-green-200' : ''}>
                {renderCellContent(comparison, columnKey)}
            </TableCell>
        );
    }, [renderCellContent]);

    return (
        <TextTable<ComparisonRootFolderTableItem>
            rows={rows}
            columns={COLUMNS}
            renderCell={renderCell}
            ariaLabel="Root Folders used in the Comparison"
        />
    );
}
