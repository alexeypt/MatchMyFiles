'use server';

import prismaClient from '@/common/helpers/prismaClient';
import NotFoundError from '@/common/models/notFoundError';
import { ComparisonProcessingStatus } from '@/clients/prisma/client';
import { processComparison } from '@/comparison/data-access/commands/createComparison';


export interface UpdateComparisonModel {
    id: number;
    description: string | null;
    primaryFolderId: number;
    folderIds: number[];
}

export default async function updateComparison(values: UpdateComparisonModel): Promise<{
    id: number;
    isReprocessingRequired: boolean;
}> {
    const comparison = await prismaClient.comparison.findFirst({
        where: {
            id: values.id
        },
        select: {
            id: true,
            comparisonRootFolders: {
                select: {
                    isPrimary: true,
                    rootFolderId: true
                }
            }
        }
    });

    const primaryComparisonRootFolder = comparison?.comparisonRootFolders.find(comparisonRootFolder => comparisonRootFolder.isPrimary);

    if (!comparison || !primaryComparisonRootFolder) {
        throw new NotFoundError();
    }

    const secondaryRootFolderIdSet = new Set(comparison.comparisonRootFolders
        .filter(comparisonRootFolder => !comparisonRootFolder.isPrimary)
        .map(comparisonRootFolder => comparisonRootFolder.rootFolderId));

    const isReprocessingRequired = primaryComparisonRootFolder.rootFolderId !== values.primaryFolderId
        || values.folderIds.length !== secondaryRootFolderIdSet.size
        || values.folderIds.some(folderId => !secondaryRootFolderIdSet.has(folderId));

    if (isReprocessingRequired) {
        // root folders have been updated, so it's easier to remove all existing root folders and add new ones
        await prismaClient.comparisonRootFolder.deleteMany({
            where: {
                comparisonId: values.id
            }
        });

        const rootFolders = values.folderIds.map(folderId => ({
            isPrimary: false,
            rootFolderId: folderId
        }));

        if (values.primaryFolderId) {
            rootFolders.push({
                isPrimary: true,
                rootFolderId: values.primaryFolderId
            });
        }

        const updatedComparison = await prismaClient.comparison.update({
            where: {
                id: values.id
            },
            data: {
                description: values.description,
                comparisonRootFolders: {
                    createMany: {
                        data: rootFolders
                    }
                },
                data: [],
                status: ComparisonProcessingStatus.Processing
            },
            select: {
                id: true
            }
        });

        await processComparison(values.primaryFolderId!, values.folderIds, comparison.id);

        return {
            id: updatedComparison.id,
            isReprocessingRequired
        };
    }

    const updatedComparison = await prismaClient.comparison.update({
        where: {
            id: values.id
        },
        data: {
            description: values.description
        }
    });

    return {
        id: updatedComparison.id,
        isReprocessingRequired
    };
}
