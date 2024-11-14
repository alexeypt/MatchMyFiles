'use server';

import { RootFolderProcessingStatus } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";
import NotFoundError from "@/common/models/notFoundError";


export interface RootFolderFileItemModel {
    id: number;
    fullName: string;
    size: number;
}

export interface RootFolderFolderItemModel {
    id: number;
    name: string;
    size: number;
    childFolderIds: number[];
    childFileIds: number[];
    parentFolderId: number | null;
}

export interface RootFolderDuplicatedFileModel {
    fileId: number;
    size: number;
    fullName: string;
    absolutePath: string;
}

export interface RootFolderDetailsModel {
    id: number;
    name: string;
    description: string | null;
    size: number;
    path: string;
    status: RootFolderProcessingStatus;
    createdAt: Date;
    duplicationData: RootFolderDuplicatedFileModel[][];
    foldersCount: number;
    filesCount: number;
    comparisonsCount: number;
    files: RootFolderFileItemModel[];
    folders: RootFolderFolderItemModel[];
}

export default async function getRootFolder(id: number): Promise<RootFolderDetailsModel> {
    const rootFolder = await prismaClient.rootFolder.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            description: true,
            size: true,
            path: true,
            status: true,
            duplicationData: true,
            createdAt: true,
            _count: {
                select: {
                    files: true,
                    folders: true,
                    comparisonRootFolders: true
                }
            },
            files: {
                select: {
                    id: true,
                    fullName: true,
                    size: true,
                    absolutePath: true
                }
            },
            folders: {
                select: {
                    id: true,
                    name: true,
                    size: true,
                    parentFolderId: true,
                    childFolders: {
                        select: {
                            id: true
                        }
                    },
                    files: {
                        select: {
                            id: true
                        }
                    }
                }
            }
        }
    });

    if (!rootFolder) {
        throw new NotFoundError();
    }

    const duplicationData = (rootFolder.duplicationData ?? []) as number[][];
    const duplicatedFileIds = new Set(duplicationData.flatMap(duplicationGroup => duplicationGroup.map(fileId => fileId)));
    const filesMap = new Map(rootFolder.files.filter(file => duplicatedFileIds.has(file.id)).map(file => ([file.id, file])));

    return {
        id: rootFolder.id,
        name: rootFolder.name,
        description: rootFolder.description,
        size: Number(rootFolder.size),
        path: rootFolder.path,
        status: rootFolder.status,
        duplicationData: duplicationData.map(duplicationGroup => duplicationGroup.map(fileId => {
            const fileInfo = filesMap.get(fileId)!;

            return {
                fileId: fileInfo.id,
                size: Number(fileInfo.size),
                fullName: fileInfo.fullName,
                absolutePath: fileInfo.absolutePath
            };
        })),
        createdAt: rootFolder.createdAt,
        filesCount: rootFolder._count.files,
        foldersCount: rootFolder._count.folders,
        comparisonsCount: rootFolder._count.comparisonRootFolders,
        files: rootFolder.files.map(file => ({
            id: file.id,
            fullName: file.fullName,
            size: Number(file.size)
        })),
        folders: rootFolder.folders.map(folder => ({
            id: folder.id,
            name: folder.name,
            size: Number(folder.size),
            parentFolderId: folder.parentFolderId,
            childFileIds: folder.files.map(file => file.id),
            childFolderIds: folder.childFolders.map(childFolder => childFolder.id)
        }))
    };
}
