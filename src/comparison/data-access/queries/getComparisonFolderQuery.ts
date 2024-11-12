'use server';

import { getRecursiveChildFolderIds } from "@prisma/client/sql";

import prismaClient from "@/common/helpers/prismaClient";
import NotFoundError from "@/common/models/notFoundError";
import { ComparisonResultData, ComparisonResultDuplicatedItemData } from "@/comparison/types/comparisonResultData";


export interface ComparisonFolderDetailsModel {
    id: number;
    name: string;
    absolutePath: string;
    relativePath: string;
    size: number;
    filesCount: number;
    duplicatedFilesCount: number;
}

export default async function getComparisonFolder(comparisonId: number, folderId: number): Promise<ComparisonFolderDetailsModel> {
    const folder = await prismaClient.folder.findFirst({
        where: {
            id: folderId
        },
        select: {
            id: true,
            name: true,
            absolutePath: true,
            relativePath: true
        }
    });

    if (!folder) {
        throw new NotFoundError();
    }

    const childFolders = await prismaClient.$queryRawTyped(getRecursiveChildFolderIds(folderId));

    const folderIds = childFolders.map(folder => folder.id!).concat(folderId);

    const files = await prismaClient.file.findMany({
        where: {
            folderId: {
                in: folderIds
            }    
        },
        select: {
            id: true,
            size: true
        }
    });

    const folderSize = files.reduce((acc, file) => acc + Number(file.size), 0);

    const comparison = await prismaClient.comparison.findFirst({
        where: {
            id: comparisonId
        },
        select: {
            data: true
        }
    });

    if (!comparison) {
        throw new NotFoundError();
    }

    const comparisonResultMap = new Map<number, ComparisonResultDuplicatedItemData[]>((comparison.data as ComparisonResultData).map(item => ([item.fileId, item.duplicatedFiles])));
    const duplicatedFiles = files.filter(file => comparisonResultMap.has(file.id));

    return {
        id: folder.id,
        name: folder.name,
        absolutePath: folder.absolutePath,
        relativePath: folder.relativePath,
        filesCount: files.length,
        duplicatedFilesCount: duplicatedFiles.length,
        size: folderSize
    };
}
