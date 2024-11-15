'use server';

import { ComparisonProcessingStatus } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";
import socketIO from "@/common/helpers/socketIOClient";
import SocketEventType from "@/common/types/socketEventType";
import reprocessRootFolder from "@/root-folder/data-access/commands/reprocessRootFolderCommand";


export default async function reprocessComparisonRootFolders(comparisonId: number, rootFolderIdsToReprocess: number[]) {
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

    for (const rootFolderId of rootFolderIdsToReprocess) {
        await reprocessRootFolder(rootFolderId);
    }
}
