'use server';

import prismaClient from '@/common/helpers/prismaClient';
import NotFoundError from '@/common/models/notFoundError';
import { getRecursiveChildFolderIds } from '@/clients/prisma/sql';
import { ComparisonResultData, ComparisonResultDuplicatedItemData } from '@/comparison/types/comparisonResultData';


export interface ComparisonFolderDetailsModel {
    id: number;
    name: string;
    size: number;
    absolutePath: string;
    relativePath: string;
    folderCreatedDate: Date;
    folderModifiedDate: Date;
    folderContentModifiedDate: Date;
    filesCount: number;
    duplicatedFilesCount: number;
    duplicatedFilesSize: number;
    duplicationInfo: {
        rootFolderId: number;
        rootFolderName: string;
        rootFolderPath: string;
        duplicatedFilesCount: number;
        duplicatedFilesSize: number;
    }[];
}

export default async function getComparisonFolder(comparisonId: number, folderId: number): Promise<ComparisonFolderDetailsModel> {
    const folder = await prismaClient.folder.findFirst({
        where: {
            id: folderId
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

    const comparison = await prismaClient.comparison.findFirst({
        where: {
            id: comparisonId
        },
        select: {
            data: true,
            comparisonRootFolders: {
                select: {
                    rootFolder: {
                        select: {
                            id: true,
                            name: true,
                            path: true
                        }
                    }
                }
            }
        }
    });

    if (!comparison) {
        throw new NotFoundError();
    }

    const comparisonResultMap = new Map<number, ComparisonResultDuplicatedItemData[]>((comparison.data as ComparisonResultData).map(item => (
        [item.fileId, item.duplicatedFiles]
    )));
    const duplicatedFiles = files.filter(file => comparisonResultMap.has(file.id));
    const duplicatedFilesSize = duplicatedFiles.reduce((acc, file) => acc + Number(file.size), 0);

    const fileSizeMap = new Map(files.map(file => ([file.id, Number(file.size)])));
    const rootFolderInfoMap = new Map(comparison.comparisonRootFolders.map(comparisonRootFolder =>
        [comparisonRootFolder.rootFolder.id, comparisonRootFolder.rootFolder]));

    const duplicationInfo = (comparison.data as ComparisonResultData)
        .filter(item => fileSizeMap.has(item.fileId))
        .reduce((map, item) => {
            // we should ignore cases when the same file is duplicated several times
            const processedRootFolders = new Set<number>();

            item.duplicatedFiles.forEach(duplicatedFile => {
                if (processedRootFolders.has(duplicatedFile.rootFolderId)) {
                    return;
                }

                const mapItem = map.get(duplicatedFile.rootFolderId);
                map.set(duplicatedFile.rootFolderId, {
                    duplicatedFilesCount: (mapItem?.duplicatedFilesCount ?? 0) + 1,
                    duplicatedFilesSize: (mapItem?.duplicatedFilesSize ?? 0) + (fileSizeMap.get(item.fileId) ?? 0)
                });

                processedRootFolders.add(duplicatedFile.rootFolderId);
            });

            return map;
        }, new Map<number, {
            duplicatedFilesCount: number;
            duplicatedFilesSize: number;
        }>());

    return {
        id: folder.id,
        name: folder.name,
        size: Number(folder.size),
        absolutePath: folder.absolutePath,
        relativePath: folder.relativePath,
        folderCreatedDate: folder.folderCreatedDate,
        folderModifiedDate: folder.folderModifiedDate,
        folderContentModifiedDate: folder.folderContentModifiedDate,
        filesCount: files.length,
        duplicatedFilesCount: duplicatedFiles.length,
        duplicatedFilesSize,
        duplicationInfo: Array.from(duplicationInfo.entries()).map(([rootFolderId, data]) => ({
            rootFolderId,
            rootFolderName: rootFolderInfoMap.get(rootFolderId)!.name,
            rootFolderPath: rootFolderInfoMap.get(rootFolderId)!.path,
            duplicatedFilesCount: data.duplicatedFilesCount,
            duplicatedFilesSize: data.duplicatedFilesSize
        }))
    };
}
