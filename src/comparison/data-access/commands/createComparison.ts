'use server';

import { ComparisonProcessingStatus, Prisma } from "@prisma/client";
import { getDuplicatedFiles } from "@prisma/client/sql";

import prismaClient from "@/common/helpers/prismaClient";
import { ComparisonResultData, ComparisonResultDuplicatedItemData } from "@/comparison/types/comparisonResultData";


export interface CreateComparisonModel {
    name: string;
    description: string | null;
    primaryFolderId: number | null;
    folderIds: number[];
}

export async function processComparison(primaryFolderId: number, secondaryFolderIds: number[], comparisonId: number) {
    const duplicatedFiles = await prismaClient.$queryRawTyped(getDuplicatedFiles(primaryFolderId, [primaryFolderId, ...secondaryFolderIds]));

    const duplicatedFilesMap = duplicatedFiles.reduce((map, file) => {
        const item = map.get(file.primaryFileId);
        if (item) {
            item.push({ fileId: file.secondaryFileId, rootFolderId: file.rootFolderId });
        } else {
            map.set(file.primaryFileId, [{ fileId: file.secondaryFileId, rootFolderId: file.rootFolderId }]);
        }

        return map;
    }, new Map<number, ComparisonResultDuplicatedItemData[]>());

    await prismaClient.comparison.update({
        where: {
            id: comparisonId
        },
        data: {
            status: ComparisonProcessingStatus.Completed,
            data: Array.from(duplicatedFilesMap.entries()).map(([primaryFileId, secondaryFiles]) => ({
                fileId: primaryFileId,
                duplicatedFiles: secondaryFiles
            })) as ComparisonResultData
        }
    });
}

export default async function createComparison(values: CreateComparisonModel) {
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
    const comparison = await prismaClient.comparison.create({
        data: {
            name: values.name,
            description: values.description,
            status: ComparisonProcessingStatus.Processing,
            comparisonRootFolders: {
                createMany: {
                    data: rootFolders
                }
            }
        },
        select: {
            id: true
        }
    });

    await processComparison(values.primaryFolderId!, values.folderIds, comparison.id);

    return comparison;
}
