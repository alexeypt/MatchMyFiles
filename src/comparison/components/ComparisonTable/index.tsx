"use client";

import React, { useCallback, useMemo } from 'react';
import { Link, TableCell } from '@nextui-org/react';

import FormattedDateTime from '@/common/components/FormattedDateTime';
import TextTable, { TextTableColumnConfiguration, TextTableRowConfiguration } from '@/common/components/TextTable';
import { COMPARISON_EDIT_ROUTE, ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { generateUrl } from '@/common/helpers/urlHelper';
import { ComparisonListItemModel } from '@/comparison/data-access/queries/getComparisonsQuery';


interface ComparisonTableProps {
    data: ComparisonListItemModel[];
}

interface ComparisonTableItem {
    index: number;
    name: string;
    rootFoldersCount: number;
    createdAt: Date;
    actions: null;
}

const COLUMNS: TextTableColumnConfiguration<ComparisonTableItem>[] = [
    {
        key: "index",
        label: '#'
    },
    {
        key: "name",
        label: "Name",
    },
    {
        key: "rootFoldersCount",
        label: "Root Folders Count",
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

export default function ComparisonTable({ data }: ComparisonTableProps) {
    const rows: TextTableRowConfiguration<ComparisonTableItem>[] = useMemo(() => {
        return data.map((item, index) => ({
            key: item.id,
            index: index + 1,
            name: item.name,
            createdAt: item.createdAt,
            rootFoldersCount: item.rootFoldersCount,
            actions: null
        }));
    }, [data]);

    const renderCellContent = useCallback((comparison: TextTableRowConfiguration<ComparisonTableItem>, columnKey: keyof ComparisonTableItem) => {
        switch (columnKey) {
            case 'createdAt':
                return (
                    <div className="text-base">
                        <FormattedDateTime dateTime={comparison.createdAt} />
                    </div>
                );
            case "actions":
                const editComparisonUrl = generateUrl(COMPARISON_EDIT_ROUTE, { id: comparison.key });

                return (
                    <Link
                        href={editComparisonUrl}
                        aria-label={`Edit ${comparison.name} comparison`}
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
        return (
            <TableCell>
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
