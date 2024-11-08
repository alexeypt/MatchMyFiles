'use server';

import { ComparisonProcessingStatus } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";


export interface ComparisonListItemModel {
    id: number;
    name: string;
    status: ComparisonProcessingStatus;
    createdAt: Date;
    rootFoldersCount: number;
}

export default async function getComparisons(): Promise<ComparisonListItemModel[]> {
    const data = await prismaClient.comparison.findMany({
        orderBy: {
            createdAt: "asc"
        },
        select: {
            id: true,
            name: true,
            status: true,
            createdAt: true,
            _count: {
                select: {
                    comparisonRootFolders: true
                }
            }
        }
    });

    return data.map(comparison => ({
        id: comparison.id,
        name: comparison.name,
        status: comparison.status,
        createdAt: comparison.createdAt,
        rootFoldersCount: comparison._count.comparisonRootFolders
    }));
}
