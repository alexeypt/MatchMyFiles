'use server';

import prismaClient from "@/common/helpers/prismaClient";
import NotFoundError from '@/common/models/notFoundError';
import { ComparisonProcessingStatus, RootFolderProcessingStatus } from '@/clients/prisma/client';
import reprocessComparison from '@/comparison/data-access/commands/reprocessComparison';
import { processRootFolder } from '@/root-folder/data-access/commands/createRootFolderCommand';


async function process(rootFolderId: number, rootFolderPath: string, comparisonIds: number[]) {
    await processRootFolder(rootFolderId, rootFolderPath);
    for (const comparisonId of comparisonIds) {
        await reprocessComparison(comparisonId);
    }
}

export default async function reprocessRootFolder(rootFolderId: number) {
    const rootFolder = await prismaClient.rootFolder.findFirst({
        where: {
            id: rootFolderId
        },
        select: {
            path: true,
            comparisonRootFolders: {
                select: {
                    comparisonId: true
                }
            }
        }
    });

    if (!rootFolder) {
        throw new NotFoundError();
    }

    const comparisonIds = rootFolder.comparisonRootFolders.map(comparisonRootFolder => comparisonRootFolder.comparisonId);

    await prismaClient.comparison.updateMany({
        where: {
            id: {
                in: comparisonIds
            }
        },
        data: {
            status: ComparisonProcessingStatus.Processing,
            data: []
        }
    });

    await prismaClient.file.deleteMany({
        where: {
            rootFolderId: rootFolderId
        }
    });

    await prismaClient.folder.deleteMany({
        where: {
            rootFolderId: rootFolderId
        }
    });

    await prismaClient.rootFolder.update({
        where: {
            id: rootFolderId
        },
        data: {
            status: RootFolderProcessingStatus.Processing,
            size: 0,
            duplicationData: []
        }
    });

    const processTask = process(rootFolderId, rootFolder.path, comparisonIds);

    return {
        rootFolderId,
        processTask
    };
}
