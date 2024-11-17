"use client";

import React, { useCallback, useMemo } from 'react';
import { Link, TableCell } from '@nextui-org/react';
import { ComparisonProcessingStatus } from '@prisma/client';

import TextTable, { TextTableColumnConfiguration, TextTableRowConfiguration } from '@/common/components/TextTable';
import { COMPARISON_EDIT_ROUTE, ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { getFormattedSize } from '@/common/helpers/fileInfoHelper';
import { pluralize } from '@/common/helpers/pluralizationHelper';
import { generateUrl } from '@/common/helpers/urlHelper';
import { ComparisonListItemModel, ComparisonListItemRootFolderModel } from '@/comparison/data-access/queries/getComparisonsQuery';


interface ComparisonTableProps {
    data: ComparisonListItemModel[];
}

interface ComparisonTableItem {
    index: number;
    status: ComparisonProcessingStatus;
    primaryRootFolder: ComparisonListItemRootFolderModel;
    secondaryRootFolders: ComparisonListItemRootFolderModel[];
    duplicatedFilesCount: number;
    duplicatedFilesPercent: number;
    actions: null;
}

const COLUMNS: TextTableColumnConfiguration<ComparisonTableItem>[] = [
    {
        key: "index",
        label: '#'
    },
    {
        key: "primaryRootFolder",
        label: "Primary Root Folder",
    },
    {
        key: "secondaryRootFolders",
        label: "Secondary Root Folders",
    },
    {
        key: "duplicatedFilesCount",
        label: "Duplicated Files Count",
    },
    {
        key: "actions",
        label: "Actions",
    }
];

export default function ComparisonTable({ data }: ComparisonTableProps) {
    const rows: TextTableRowConfiguration<ComparisonTableItem>[] = useMemo(() => {
        return data.map((item, index) => ({
            key: item.id,
            index: index + 1,
            status: item.status,
            primaryRootFolder: item.primaryRootFolder,
            secondaryRootFolders: item.secondaryRootFolders,
            duplicatedFilesCount: item.duplicatedFilesCount,
            duplicatedFilesPercent: item.duplicatedFilesPercent,
            actions: null
        }));
    }, [data]);

    const renderCellContent = useCallback((comparison: TextTableRowConfiguration<ComparisonTableItem>, columnKey: keyof ComparisonTableItem) => {
        switch (columnKey) {
            case 'duplicatedFilesCount':
                return (
                    <div className="text-base">
                        {pluralize(comparison.duplicatedFilesCount, 'duplicated file')}
                        {comparison.duplicatedFilesPercent > 0 ? ` (${comparison.duplicatedFilesPercent}%)` : ''}
                    </div>
                );
            case 'primaryRootFolder':
                return (
                    <div className="text-base">
                        <Link
                            href={generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: comparison.primaryRootFolder.id })}
                            underline="hover"
                        >
                            <span className="font-bold">{comparison.primaryRootFolder.name}&nbsp;</span>
                        </Link>
                        <span>({comparison.primaryRootFolder.path}, {getFormattedSize(comparison.primaryRootFolder.size)})</span>
                    </div>
                );
            case 'secondaryRootFolders':
                return (
                    <div className="text-base">
                        <ul className="flex flex-col gap-2">
                            {comparison.secondaryRootFolders.map(item => (
                                <li key={item.id}>
                                    <Link
                                        href={generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: item.id })}
                                        underline="hover"
                                    >
                                        <span className="font-bold">{item.name}&nbsp;</span>
                                    </Link>
                                    <span>({item.path}, {getFormattedSize(item.size)})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case "actions":
                const editComparisonUrl = generateUrl(COMPARISON_EDIT_ROUTE, { id: comparison.key });

                return (
                    <Link
                        href={editComparisonUrl}
                        aria-label={`Edit ${comparison.primaryRootFolder.name} comparison`}
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
                        {comparison[columnKey] as string | number}
                    </span>
                );
        }
    }, []);

    const renderCell = useCallback((comparison: TextTableRowConfiguration<ComparisonTableItem>, columnKey: keyof ComparisonTableItem) => {
        const backgroundClassName = comparison.status === ComparisonProcessingStatus.Processing
            ? 'bg-yellow-100'
            : comparison.status === ComparisonProcessingStatus.Failed
                ? 'bg-red-100'
                : undefined;

        return (
            <TableCell className={backgroundClassName}>
                {renderCellContent(comparison, columnKey)}
            </TableCell>
        );
    }, [renderCellContent]);

    return (
        <TextTable<ComparisonTableItem>
            rows={rows}
            columns={COLUMNS}
            renderCell={renderCell}
            ariaLabel="Existing Comparisons"
        />
    );
}
