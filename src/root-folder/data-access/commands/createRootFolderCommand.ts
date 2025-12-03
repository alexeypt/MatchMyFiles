'use server';

import prismaClient from '@/common/helpers/prismaClient';
import socketIO from '@/common/helpers/socketIOClient';
import SocketEventType from '@/common/types/socketEventType';
import { RootFolderProcessingStatus } from '@/clients/prisma/client';
import { getSelfDuplicatedFiles } from '@/clients/prisma/sql';
import { FolderInfoModel, RootFolderProcessor } from '@/root-folder/services/rootFolderProcessor';


export interface CreateRootFolderModel {
    folderPath: string;
    name: string;
    description: string;
}

async function createFolder(folderInfo: FolderInfoModel, rootFolderId: number, parentFolderId: number | null) {
    const folder = await prismaClient.folder.create({
        data: {
            name: folderInfo.name,
            absolutePath: folderInfo.absolutePath,
            relativePath: folderInfo.relativePath,
            size: folderInfo.size,
            folderCreatedDate: folderInfo.createdDate,
            folderModifiedDate: folderInfo.modifiedDate,
            folderContentModifiedDate: folderInfo.contentModifiedDate,
            rootFolderId: rootFolderId,
            parentFolderId: parentFolderId,
            files: {
                createMany: {
                    data: folderInfo.files.map(file => ({
                        name: file.name,
                        fullName: file.fullName,
                        absolutePath: file.absolutePath,
                        relativePath: file.relativePath,
                        extension: file.extension,
                        hash: file.hash,
                        rootFolderId: rootFolderId,
                        size: file.size,
                        latitude: file.latitude,
                        longitude: file.longitude,
                        fileCreatedDate: file.createdDate,
                        fileModifiedDate: file.modifiedDate,
                        fileContentModifiedDate: file.contentModifiedDate
                    }))
                }
            }
        }
    });

    for (const childFolder of folderInfo.childFolders) {
        await createFolder(childFolder, rootFolderId, folder.id);
    }
}

export async function processRootFolder(rootFolderId: number, rootFolderPath: string) {
    const rootFolderProcessor = new RootFolderProcessor(rootFolderPath, rootFolderId);

    let rootFolderInfo: FolderInfoModel | null = null;

    try {
        rootFolderInfo = await rootFolderProcessor.start();
        await createFolder(rootFolderInfo, rootFolderId, null);
    } catch {
        const updateRootFolder = await prismaClient.rootFolder.update({
            where: {
                id: rootFolderId
            },
            data: {
                status: RootFolderProcessingStatus.Failed
            }
        });

        socketIO.io.emit(SocketEventType.RootFolderProcessingFailed, updateRootFolder.id, updateRootFolder.name);

        return;
    }

    const duplicatedFiles = await prismaClient.$queryRawTyped(getSelfDuplicatedFiles(rootFolderId));
    const duplicationData = duplicatedFiles.map(duplicatedGroup => (duplicatedGroup.fileIds as number[]));

    const updateRootFolder = await prismaClient.rootFolder.update({
        where: {
            id: rootFolderId
        },
        data: {
            status: RootFolderProcessingStatus.Completed,
            size: rootFolderInfo.size,
            duplicationData
        }
    });

    socketIO.io.emit(SocketEventType.RootFolderProcessingCompleted, updateRootFolder.id, updateRootFolder.name);
}

export default async function createRootFolder(values: CreateRootFolderModel) {
    let rootFolderName = values.name;

    if (!rootFolderName) {
        rootFolderName = values.folderPath.split(/\\|\//).at(-1) ?? values.folderPath;
    }


    const rootFolder = await prismaClient.rootFolder.create({
        data: {
            name: rootFolderName,
            description: values.description,
            path: values.folderPath,
            size: 0,
            status: 'Processing'
        }
    });

    processRootFolder(rootFolder.id, rootFolder.path);

    return rootFolder.id;
}
