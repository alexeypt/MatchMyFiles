import React from 'react';
import { Table, TableBody, TableColumn, TableHeader, TableRow } from '@heroui/table';
import { CellElement } from '@react-types/table/src/index';


export interface TextTableColumnConfiguration<T> {
    key: keyof T;
    label: string;
    width?: string;
}

export type TextTableRowConfiguration<T> = T & { key: number | string };

interface TextTableProps<T> {
    columns: TextTableColumnConfiguration<T>[];
    rows: TextTableRowConfiguration<T>[];
    renderCell: (row: TextTableRowConfiguration<T>, columnKey: keyof T) => CellElement;
    ariaLabel: string;
}

export default function TextTable<T>({
    columns,
    rows,
    renderCell,
    ariaLabel
}: TextTableProps<T>) {
    return (
        <Table
            aria-label={ariaLabel}
            classNames={
                {
                    td: 'border-1 p-0 *:p-3 *:h-full *:flex *:items-center *:justify-center text-center text-base',
                    th: 'border-1 p-3 text-center text-bold text-base whitespace-normal',
                    tr: 'hover:bg-yellow-50',
                    wrapper: 'min-w-[50vw] overflow-x-auto p-0 md:p-4',
                    table: 'h-full wrap-normal',
                    emptyWrapper: 'text-foreground-500'
                }
            }
            isStriped
            fullWidth
        >
            <TableHeader columns={columns}>
                {
                    column => (
                        <TableColumn
                            key={column.key as string}
                            style={
                                {
                                    width: column.width
                                }
                            }
                        >
                            {column.label}
                        </TableColumn>
                    )
                }
            </TableHeader>
            <TableBody
                items={rows}
                emptyContent="No rows to display"
            >
                {
                    item => (
                        <TableRow key={item.key}>
                            {
                                columnKey => {
                                    return renderCell(item, columnKey as keyof T);
                                }
                            }
                        </TableRow>
                    )
                }
            </TableBody>
        </Table>
    );
}
