'use server';

import prismaClient from '@/common/helpers/prismaClient';
import NotFoundError from '@/common/models/notFoundError';


export interface FolderDetailsModel {
    id: number;
    name: string;
    size: number;
    absolutePath: string;
    relativePath: string;
    folderCreatedDate: Date;
    folderModifiedDate: Date;
    folderContentModifiedDate: Date;
}

export default async function getFolder(id: number): Promise<FolderDetailsModel> {
    const folder = await prismaClient.folder.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            size: true,
            absolutePath: true,
            relativePath: true,
            folderCreatedDate: true,
            folderModifiedDate: true,
            folderContentModifiedDate: true
        }
    });

    if (!folder) {
        throw new NotFoundError();
    }

    return {
        id: folder.id,
        name: folder.name,
        size: Number(folder.size),
        absolutePath: folder.absolutePath,
        relativePath: folder.relativePath,
        folderCreatedDate: folder.folderCreatedDate,
        folderModifiedDate: folder.folderModifiedDate,
        folderContentModifiedDate: folder.folderContentModifiedDate
    };
}
