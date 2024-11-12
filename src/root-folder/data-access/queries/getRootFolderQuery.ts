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

export interface RootFolderDetailsModel {
    id: number;
    name: string;
    description: string | null;
    size: number;
    path: string;
    status: RootFolderProcessingStatus;
    createdAt: Date;
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
                    size: true
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

    return {
        id: rootFolder.id,
        name: rootFolder.name,
        description: rootFolder.description,
        size: Number(rootFolder.size),
        path: rootFolder.path,
        status: rootFolder.status,
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
