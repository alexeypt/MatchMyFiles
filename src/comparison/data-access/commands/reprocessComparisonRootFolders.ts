'use server';

import prismaClient from '@/common/helpers/prismaClient';
import socketIO from '@/common/helpers/socketIOClient';
import SocketEventType from '@/common/types/socketEventType';
import { ComparisonProcessingStatus } from '@/clients/prisma/client';
import reprocessRootFolder from '@/root-folder/data-access/commands/reprocessRootFolderCommand';


async function waitTasks(comparisonId: number, reprocessTasks: Promise<void>[]) {
    await Promise.all(reprocessTasks);

    socketIO.io.emit(SocketEventType.ComparisonProcessingCompleted, comparisonId);
}

export default async function reprocessComparisonRootFolders(comparisonId: number, rootFolderIdsToReprocess: number[]) {
    socketIO.io.emit(SocketEventType.ComparisonProcessingStarted, comparisonId);

    await prismaClient.comparison.update({
        where: {
            id: comparisonId
        },
        data: {
            status: ComparisonProcessingStatus.Processing
        }
    });

    for (const rootFolderId of rootFolderIdsToReprocess) {
        socketIO.io.emit(SocketEventType.RootFolderProcessingStatus, rootFolderId, 0, 'Not Started');
    }

    const reprocessTasks: Promise<void>[] = [];

    for (const rootFolderId of rootFolderIdsToReprocess) {
        const reprocessResult = await reprocessRootFolder(rootFolderId);
        reprocessTasks.push(reprocessResult.processTask);
    }

    waitTasks(comparisonId, reprocessTasks);
}
