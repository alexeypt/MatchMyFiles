'use server';

import prismaClient from "@/common/helpers/prismaClient";
import { RootFolderProcessingStatus } from "@/clients/prisma/client";


export interface RootFolderListItemModel {
    id: number;
    name: string;
    path: string;
    size: number;
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
            size: true,
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
        size: Number(rootFolder.size),
        status: rootFolder.status,
        createdAt: rootFolder.createdAt,
        filesCount: rootFolder._count.files,
        foldersCount: rootFolder._count.folders
    }));
}
