"use client";

import React, { useCallback, useMemo } from 'react';
import { Link, TableCell } from '@nextui-org/react';
import classNames from 'classnames';

import TextTable, { TextTableColumnConfiguration, TextTableRowConfiguration } from '@/common/components/TextTable';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { convertHexToRgbaColor } from '@/common/helpers/colorHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { roundNumber } from '@/common/helpers/numberHelper';
import { generateUrl } from '@/common/helpers/urlHelper';
import { ComparisonRootFolderItemModel } from '@/comparison/data-access/queries/getComparisonQuery';


interface ComparisonRootFolderTableProps {
    data: ComparisonRootFolderItemModel[];
    rootFolderColorMap: Map<number, string>;
}

interface ComparisonRootFolderTableItem {
    isPrimary: boolean;
    index: number;
    id: number;
    name: string;
    path: string;
    size: number;
    totalFilesCount: number;
    duplicatedFilesCount: number;
    duplicatedFilesCountPercent: number;
    duplicatedFilesSize: number;
    duplicatedFilesSizePercent: number;
    duplicatedColor?: string;
    partiallyDuplicatedColor?: string;
}

const COLUMNS: TextTableColumnConfiguration<ComparisonRootFolderTableItem>[] = [
    {
        key: "index",
        label: '#'
    },
    {
        key: "name",
        label: "Name"
    },
    {
        key: "path",
        label: "Path"
    },
    {
        key: "duplicatedFilesCount",
        label: "Duplicated Files Count"
    },
    {
        key: "duplicatedFilesSize",
        label: "Duplicated Files Size"
    },
    {
        key: "duplicatedColor",
        label: "Duplicated color",
        width: '200px'
    },
    {
        key: "partiallyDuplicatedColor",
        label: "Partially Duplicated color",
        width: '200px'
    },
];

export default function ComparisonRootFolderTable({ data, rootFolderColorMap }: ComparisonRootFolderTableProps) {
    const rows: TextTableRowConfiguration<ComparisonRootFolderTableItem>[] = useMemo(() => {
        return data.map((item, index) => ({
            key: item.id,
            index: index + 1,
            id: item.id,
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
            duplicatedColor: rootFolderColorMap.get(item.id),
            partiallyDuplicatedColor: rootFolderColorMap.has(item.id)
                ? convertHexToRgbaColor(rootFolderColorMap.get(item.id)!, 0.5)
                : undefined
        }));
    }, [data, rootFolderColorMap]);

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
                const duplicatedCellStyles = {
                    '--duplicated-color': rootFolder.duplicatedColor
                };

                const duplicatedCellClassName = classNames(
                    'text-base',
                    'bg-[--duplicated-color]'
                );

                return (
                    <div
                        style={duplicatedCellStyles}
                        className={duplicatedCellClassName}
                    />
                );
            case 'partiallyDuplicatedColor':
                const partiallyDuplicatedCellStyles = {
                    '--partially-duplicated-color': rootFolder.partiallyDuplicatedColor
                };

                const partiallyDuplicatedCellClassName = classNames(
                    'text-base',
                    'bg-[--partially-duplicated-color]'
                );

                return (
                    <div
                        style={partiallyDuplicatedCellStyles}
                        className={partiallyDuplicatedCellClassName}
                    />
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
            <TableCell className={comparison.isPrimary && columnKey !== 'partiallyDuplicatedColor' ? 'bg-green-200' : ''}>
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
