'use server';

import { RootFolder } from '@prisma/client';
import { getSelfDuplicatedFiles } from '@prisma/client/sql';

import prismaClient from "@/common/helpers/prismaClient";
import socketIO from '@/common/helpers/socketIOClient';
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

async function processRootFolder(rootFolder: RootFolder) {
    const rootFolderProcessor = new RootFolderProcessor(rootFolder.path, rootFolder.id);
    const rootFolderInfo = await rootFolderProcessor.start();

    await createFolder(rootFolderInfo, rootFolder.id, null);

    const duplicatedFiles = await prismaClient.$queryRawTyped(getSelfDuplicatedFiles(rootFolder.id));
    const duplicationData = duplicatedFiles.map(duplicatedGroup => (duplicatedGroup.fileIds as number[]));

    await prismaClient.rootFolder.update({
        where: {
            id: rootFolder.id
        },
        data: {
            status: 'Completed',
            size: rootFolderInfo.size,
            duplicationData
        }
    });

    socketIO.io.emit('rootFolder:processingCompleted', rootFolder.id);
}

export default async function createRootFolder(values: CreateRootFolderModel) {
    const rootFolder = await prismaClient.rootFolder.create({
        data: {
            name: values.name,
            description: values.description,
            path: values.folderPath,
            size: 0,
            status: 'Processing'
        }
    });

    processRootFolder(rootFolder);

    return rootFolder.id;
}
