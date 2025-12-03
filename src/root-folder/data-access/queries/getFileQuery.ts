'use server';

import prismaClient from '@/common/helpers/prismaClient';
import NotFoundError from '@/common/models/notFoundError';


export interface FileDetailsModel {
    id: number;
    name: string;
    size: number;
    absolutePath: string;
    relativePath: string;
    extension: string;
    fullName: string;
    latitude: number | null;
    longitude: number | null;
    fileCreatedDate: Date;
    fileModifiedDate: Date;
    fileContentModifiedDate: Date;
}

export default async function getFile(id: number): Promise<FileDetailsModel> {
    const file = await prismaClient.file.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            size: true,
            absolutePath: true,
            relativePath: true,
            extension: true,
            fullName: true,
            latitude: true,
            longitude: true,
            fileCreatedDate: true,
            fileModifiedDate: true,
            fileContentModifiedDate: true
        }
    });

    if (!file) {
        throw new NotFoundError();
    }

    return {
        id: file.id,
        name: file.name,
        fullName: file.fullName,
        extension: file.extension,
        size: Number(file.size),
        absolutePath: file.absolutePath,
        relativePath: file.relativePath,
        latitude: file.latitude,
        longitude: file.longitude,
        fileCreatedDate: file.fileCreatedDate,
        fileModifiedDate: file.fileModifiedDate,
        fileContentModifiedDate: file.fileContentModifiedDate
    };
}
