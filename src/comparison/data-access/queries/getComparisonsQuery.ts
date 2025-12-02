'use server';

import { roundNumber } from "@/common/helpers/numberHelper";
import prismaClient from "@/common/helpers/prismaClient";
import { ComparisonProcessingStatus } from "@/clients/prisma/client";
import { getComparisonStatus } from "@/comparison/helpers/comparisonHelper";
import { ComparisonResultData } from "@/comparison/types/comparisonResultData";


export interface ComparisonListItemRootFolderModel {
    id: number;
    name: string;
    size: number;
    path: string;
}

export interface ComparisonListItemModel {
    id: number;
    duplicatedFilesCount: number;
    duplicatedFilesPercent: number;
    status: ComparisonProcessingStatus;
    primaryRootFolder: ComparisonListItemRootFolderModel;
    secondaryRootFolders: ComparisonListItemRootFolderModel[];
}

export default async function getComparisons(): Promise<ComparisonListItemModel[]> {
    const comparisons = await prismaClient.comparison.findMany({
        orderBy: {
            createdAt: "asc"
        },
        select: {
            id: true,
            status: true,
            createdAt: true,
            data: true,
            comparisonRootFolders: {
                select: {
                    isPrimary: true,
                    rootFolder: {
                        select: {
                            id: true,
                            name: true,
                            size: true,
                            path: true,
                            status: true,
                            _count: {
                                select: {
                                    files: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    return comparisons.map(comparison => {
        const duplicatedFilesCount = (comparison.data as ComparisonResultData).length;

        const primaryRootFolder = comparison.comparisonRootFolders.find(item => item.isPrimary)!;
        const secondaryRootFolders = comparison.comparisonRootFolders.filter(item => !item.isPrimary);

        const status = getComparisonStatus(
            comparison.status,
            comparison.comparisonRootFolders.map(comparisonRootFolder => comparisonRootFolder.rootFolder.status)
        );

        return {
            id: comparison.id,
            duplicatedFilesCount,
            duplicatedFilesPercent: primaryRootFolder.rootFolder._count.files > 0
                ? roundNumber(duplicatedFilesCount / primaryRootFolder.rootFolder._count.files * 100.0, 1)
                : 0,
            status,
            primaryRootFolder: {
                id: primaryRootFolder.rootFolder.id,
                name: primaryRootFolder.rootFolder.name,
                path: primaryRootFolder.rootFolder.path,
                size: Number(primaryRootFolder.rootFolder.size)
            },
            secondaryRootFolders: secondaryRootFolders.map(item => ({
                id: item.rootFolder.id,
                name: item.rootFolder.name,
                path: item.rootFolder.path,
                size: Number(item.rootFolder.size)
            }))
        };
    });
}
