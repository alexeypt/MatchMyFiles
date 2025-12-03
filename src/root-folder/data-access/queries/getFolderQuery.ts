'use server';

import { notFound } from 'next/navigation';

import prismaClient from '@/common/helpers/prismaClient';


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
        notFound();
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
