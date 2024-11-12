'use server';

import { ComparisonProcessingStatus } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";
import NotFoundError from "@/common/models/notFoundError";
import FolderDuplicationMode from "@/comparison/models/folderDuplicationMode";
import { ComparisonResultData, ComparisonResultDuplicatedItemData } from "@/comparison/types/comparisonResultData";


export interface ComparisonFileItemModel {
    id: number;
    fullName: string;
    size: number;
    isDuplicated: boolean;
}

export interface ComparisonFolderItemModel {
    id: number;
    name: string;
    childFolderIds: number[];
    childFileIds: number[];
    parentFolderId: number | null;
    duplicationMode: FolderDuplicationMode;
}

export interface ComparisonRootFolderItemModel {
    isPrimary: boolean;
    id: number;
    name: string;
    path: string;
    size: number;
    totalFilesCount: number;
    duplicatedFilesCount: number;
    duplicatedFilesSize: number;
}

export interface ComparisonDetailsModel {
    id: number;
    name: string;
    description: string | null;
    status: ComparisonProcessingStatus;
    createdAt: Date;
    primaryRootFolder: ComparisonRootFolderItemModel;
    rootFolders: ComparisonRootFolderItemModel[];
    files: ComparisonFileItemModel[];
    folders: ComparisonFolderItemModel[];
}

function setFoldersDuplicationMode(folder: ComparisonFolderItemModel, filesMap: Map<number, boolean>, foldersMap: Map<number, ComparisonFolderItemModel>) {
    const areFilesTotallyDuplicated = folder.childFileIds.every(fileId => filesMap.get(fileId));
    const hasAnyDuplicate = folder.childFileIds.some(fileId => filesMap.get(fileId));

    let folderDuplicationMode = areFilesTotallyDuplicated
        ? FolderDuplicationMode.Full
        : hasAnyDuplicate
            ? FolderDuplicationMode.Partial
            : FolderDuplicationMode.None;

    for (const childFolderId of folder.childFolderIds) {
        const childFolderDuplicationMode = setFoldersDuplicationMode(foldersMap.get(childFolderId)!, filesMap, foldersMap);

        if (childFolderDuplicationMode === FolderDuplicationMode.Full) {
            folderDuplicationMode = folderDuplicationMode === FolderDuplicationMode.Full ? FolderDuplicationMode.Full : FolderDuplicationMode.Partial;
        }

        if (childFolderDuplicationMode === FolderDuplicationMode.Partial) {
            folderDuplicationMode = FolderDuplicationMode.Partial;
        }

        if (childFolderDuplicationMode === FolderDuplicationMode.None) {
            folderDuplicationMode = folderDuplicationMode === FolderDuplicationMode.None ? FolderDuplicationMode.None : FolderDuplicationMode.Partial;
        }
    }

    folder.duplicationMode = folderDuplicationMode;

    return folderDuplicationMode;
}

export default async function getComparison(id: number): Promise<ComparisonDetailsModel> {
    const comparison = await prismaClient.comparison.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            description: true,
            status: true,
            createdAt: true,
            data: true,
            comparisonRootFolders: {
                select: {
                    isPrimary: true,
                    rootFolder: {
                        select: {
                            id: true,
                            name: true,
                            path: true,
                            size: true,
                            _count: {
                                select: {
                                    files: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    const primaryComparisonRootFolder = comparison?.comparisonRootFolders.find(comparisonRootFolder => comparisonRootFolder.isPrimary);

    if (!comparison || !primaryComparisonRootFolder) {
        throw new NotFoundError();
    }

    const primaryRootFolderDetails = await prismaClient.rootFolder.findFirst({
        where: {
            id: primaryComparisonRootFolder.rootFolder.id
        },
        select: {
            id: true,
            name: true,
            path: true,
            size: true,
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

    if (!primaryRootFolderDetails) {
        throw new NotFoundError();
    }

    const comparisonResultMap = new Map<number, ComparisonResultDuplicatedItemData[]>(
        (comparison.data as ComparisonResultData).map(item => ([item.fileId, item.duplicatedFiles]))
    );

    const foldersMap = new Map<number, ComparisonFolderItemModel>(primaryRootFolderDetails.folders.map(folder => [folder.id, {
        id: folder.id,
        name: folder.name,
        parentFolderId: folder.parentFolderId,
        childFileIds: folder.files.map(file => file.id),
        childFolderIds: folder.childFolders.map(childFolder => childFolder.id),
        duplicationMode: FolderDuplicationMode.None
    }]));
    const filesMap = new Map<number, boolean>(primaryRootFolderDetails.files.map(file => [file.id, comparisonResultMap.has(file.id)]));

    const primaryFolder = primaryRootFolderDetails.folders.find(folder => folder.parentFolderId === null)!;

    setFoldersDuplicationMode(foldersMap.get(primaryFolder.id)!, filesMap, foldersMap);

    const totalDuplicatedFilesSize = primaryRootFolderDetails.files
        .filter(file => comparisonResultMap.has(file.id))
        .reduce((acc, file) => acc + Number(file.size), 0);
    const totalDuplicatedFilesSizeByRootFolderId = primaryRootFolderDetails.files
        .filter(file => comparisonResultMap.has(file.id))
        .reduce((map, file) => {
            // we should ignore cases when the same file is duplicated several times
            const processedRootFolders = new Set<number>();

            comparisonResultMap.get(file.id)!.forEach(duplicatedFile => {
                if (processedRootFolders.has(duplicatedFile.rootFolderId)) {
                    return;
                }

                if (map.has(duplicatedFile.rootFolderId)) {
                    const currentValue = map.get(duplicatedFile.rootFolderId)!;
                    map.set(duplicatedFile.rootFolderId, {
                        totalSize: currentValue.totalSize + Number(file.size),
                        totalCount: currentValue.totalCount + 1
                    });
                } else {
                    map.set(duplicatedFile.rootFolderId, { totalSize: Number(file.size), totalCount: 1 });
                }
                processedRootFolders.add(duplicatedFile.rootFolderId);
            });

            return map;
        }, new Map<number, { totalSize: number; totalCount: number; }>);

    return {
        id: comparison.id,
        name: comparison.name,
        description: comparison.description,
        status: comparison.status,
        createdAt: comparison.createdAt,
        primaryRootFolder: {
            isPrimary: true,
            id: primaryRootFolderDetails.id,
            name: primaryRootFolderDetails.name,
            path: primaryRootFolderDetails.path,
            size: Number(primaryRootFolderDetails.size),
            totalFilesCount: primaryRootFolderDetails.files.length,
            duplicatedFilesCount: comparisonResultMap.size,
            duplicatedFilesSize: totalDuplicatedFilesSize
        },
        rootFolders: comparison.comparisonRootFolders
            .filter(comparisonRootFolder => !comparisonRootFolder.isPrimary)
            .map(comparisonRootFolder => ({
                isPrimary: false,
                id: comparisonRootFolder.rootFolder.id,
                name: comparisonRootFolder.rootFolder.name,
                path: comparisonRootFolder.rootFolder.path,
                size: Number(comparisonRootFolder.rootFolder.size),
                totalFilesCount: comparisonRootFolder.rootFolder._count.files,
                duplicatedFilesSize: totalDuplicatedFilesSizeByRootFolderId.get(comparisonRootFolder.rootFolder.id)?.totalSize ?? 0,
                duplicatedFilesCount: totalDuplicatedFilesSizeByRootFolderId.get(comparisonRootFolder.rootFolder.id)?.totalCount ?? 0
            })),
        files: primaryRootFolderDetails.files.map(file => ({
            id: file.id,
            fullName: file.fullName,
            size: Number(file.size),
            isDuplicated: comparisonResultMap.has(file.id)
        })),
        folders: Array.from(foldersMap.values())
    };
}
