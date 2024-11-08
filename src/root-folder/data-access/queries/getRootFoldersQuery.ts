'use server';

import { RootFolderProcessingStatus } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";


export interface RootFolderListItemModel {
    id: number;
    name: string;
    path: string;
    status: RootFolderProcessingStatus;
    createdAt: Date;
    foldersCount: number;
    filesCount: number;
}

export default async function getRootFolders(): Promise<RootFolderListItemModel[]> {
    const data = await prismaClient.rootFolder.findMany({
        orderBy: {
            createdAt: "asc"
        },
        select: {
            id: true,
            name: true,
            path: true,
            status: true,
            createdAt: true,
            _count: {
                select: {
                    files: true,
                    folders: true
                }
            }
        }
    });

    return data.map(rootFolder => ({
        id: rootFolder.id,
        name: rootFolder.name,
        path: rootFolder.path,
        status: rootFolder.status,
        createdAt: rootFolder.createdAt,
        filesCount: rootFolder._count.files,
        foldersCount: rootFolder._count.folders
    }));
}
