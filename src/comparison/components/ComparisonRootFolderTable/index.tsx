"use client";

import React, { useCallback, useMemo } from 'react';
import { Link } from "@heroui/link";
import { TableCell } from "@heroui/table";
import classNames from 'classnames';

import TextTable, { TextTableColumnConfiguration, TextTableRowConfiguration } from '@/common/components/TextTable';
import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { convertHexToRgbaColor } from '@/common/helpers/colorHelper';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { roundNumber } from '@/common/helpers/numberHelper';
import { getFormattedStringWithWordBreaks } from '@/common/helpers/stringHelper';
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
        width: '170px'
    },
    {
        key: "partiallyDuplicatedColor",
        label: "Partially Duplicated color",
        width: '170px'
    }
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
            duplicatedFilesSizePercent: item.size > 0
                ? roundNumber(item.duplicatedFilesSize / item.size * 100.0, 1)
                : 0,
            duplicatedColor: rootFolderColorMap.get(item.id),
            partiallyDuplicatedColor: rootFolderColorMap.has(item.id)
                ? convertHexToRgbaColor(rootFolderColorMap.get(item.id)!, 0.5)
                : undefined
        }));
    }, [data, rootFolderColorMap]);

    const renderCellContent = useCallback((
        rootFolder: TextTableRowConfiguration<ComparisonRootFolderTableItem>,
        columnKey: keyof ComparisonRootFolderTableItem
    ) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div className="text-base min-w-32 md:min-w-fit">
                        <Link
                            href={generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: rootFolder.key })}
                            underline="hover"
                        >
                            <span
                                className="font-bold"
                                dangerouslySetInnerHTML={{
                                    __html: getFormattedStringWithWordBreaks(rootFolder.name)
                                }}
                            />
                        </Link>
                    </div>
                );
            case 'path':
                return (
                    <div className="text-base">
                        <span
                            className="text-base min-w-40 md:min-w-fit"
                            dangerouslySetInnerHTML={{
                                __html: getFormattedStringWithWordBreaks(rootFolder.path)
                            }}
                        />
                    </div>
                );
            case 'duplicatedFilesCount':
                return (
                    <div className="text-base min-w-32 md:min-w-28">
                        {rootFolder.duplicatedFilesCount} / {rootFolder.totalFilesCount}
                        {' '}
                        ({rootFolder.duplicatedFilesCountPercent}%)
                    </div>
                );
            case 'duplicatedFilesSize':
                return (
                    <div className="text-base min-w-32 md:min-w-28">
                        {getFormattedSize(rootFolder.duplicatedFilesSize)} / {getFormattedSize(rootFolder.size)}
                        {' '}
                        ({rootFolder.duplicatedFilesSizePercent}%)
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

    const renderCell = useCallback((rootFolder: TextTableRowConfiguration<ComparisonRootFolderTableItem>, columnKey: keyof ComparisonRootFolderTableItem) => {
        if (columnKey === 'partiallyDuplicatedColor') {
            const partiallyDuplicatedCellStyles = {
                '--partially-duplicated-color': rootFolder.partiallyDuplicatedColor
            };

            const partiallyDuplicatedCellClassName = classNames(
                'text-base',
                'bg-(--partially-duplicated-color)'
            );

            return (
                <TableCell
                    style={partiallyDuplicatedCellStyles}
                    className={partiallyDuplicatedCellClassName}
                >
                    &nbsp;
                </TableCell>
            );
        }

        if (columnKey === 'duplicatedColor') {
            const duplicatedCellStyles = {
                '--duplicated-color': rootFolder.duplicatedColor
            };

            const duplicatedCellClassName = classNames(
                'text-base',
                'bg-(--duplicated-color)'
            );


            return (
                <TableCell
                    style={duplicatedCellStyles}
                    className={duplicatedCellClassName}
                >
                    &nbsp;
                </TableCell>
            );
        }

        if (!rootFolder.isPrimary && (
            (columnKey === 'duplicatedFilesCount' && rootFolder.duplicatedFilesCount > 0) ||
            (columnKey === 'duplicatedFilesSize' && rootFolder.duplicatedFilesSize > 0)
        )) {
            return (
                <TableCell className="bg-yellow-200">
                    {renderCellContent(rootFolder, columnKey)}
                </TableCell>
            );
        }

        return (
            <TableCell className={rootFolder.isPrimary ? 'bg-green-200' : ''}>
                {renderCellContent(rootFolder, columnKey)}
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
