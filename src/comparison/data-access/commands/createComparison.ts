'use server';

import { ComparisonProcessingStatus, Prisma } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";
import { ComparisonResultData } from "@/comparison/types/comparisonResultData";


export interface CreateComparisonModel {
    name: string;
    description: string | null;
    primaryFolderId: number | null;
    folderIds: number[];
}

async function processComparison(comparison: CreateComparisonModel, comparisonId: number) {
    // TODO: moved to prisma typed sql
    const duplicatedFiles = await prismaClient.$queryRaw<{
        primaryFileId: number;
        secondaryFileId: number;
    }[]>`
        select f1.id as "primaryFileId", f2.id as "secondaryFileId"
        from public."File" f1
        join public."File" f2 on f1.hash = f2.hash
        where f1."rootFolderId" in (${comparison.primaryFolderId}) and f2."rootFolderId" in (${Prisma.join(comparison.folderIds)})
    `;

    const duplicatedFilesMap = duplicatedFiles.reduce((map, file) => {
        const item = map.get(file.primaryFileId);
        if (item) {
            item.push(file.secondaryFileId);
        } else {
            map.set(file.primaryFileId, [file.secondaryFileId]);
        }

        return map;
    }, new Map<number, number[]>());

    await prismaClient.comparison.update({
        where: {
            id: comparisonId
        },
        data: {
            status: ComparisonProcessingStatus.Completed,
            data: Array.from(duplicatedFilesMap.entries()).map(([primaryFileId, secondaryFileIds]) => ({
                fileId: primaryFileId,
                duplicatedFileIds: secondaryFileIds
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

    await processComparison(values, comparison.id);

    return comparison;
}
