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
    duplicatedRootFolderIds: number[];
}

export interface ComparisonFolderItemModel {
    id: number;
    name: string;
    size: number;
    childFolderIds: number[];
    childFileIds: number[];
    parentFolderId: number | null;
    duplicationInfo: {
        rootFolderId: number;
        duplicationMode: FolderDuplicationMode;
    }[];
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

function setFoldersDuplicationMode(
    folder: ComparisonFolderItemModel,
    secondaryRootFolderIds: number[],
    comparisonResultMap: Map<number, ComparisonResultDuplicatedItemData[]>,
    foldersMap: Map<number, ComparisonFolderItemModel>
) {
    const totalFilesCount = folder.childFileIds.length;

    const duplicatedFilesCountMap = folder.childFileIds
        .reduce((map, childFileId) => {
            // we should ignore cases when the same file is duplicated several times
            const processedRootFolders = new Set<number>();

            comparisonResultMap.get(childFileId)?.forEach(duplicatedFile => {
                if (processedRootFolders.has(duplicatedFile.rootFolderId)) {
                    return;
                }

                const mapItem = map.get(duplicatedFile.rootFolderId);
                const count = (mapItem ?? 0) + 1;
                map.set(duplicatedFile.rootFolderId, count);

                processedRootFolders.add(duplicatedFile.rootFolderId);
            });

            return map;
        }, new Map<number, number>());

    const duplicationInfoMap = new Map(secondaryRootFolderIds.map(rootFolderId => {
        let folderDuplicationMode = FolderDuplicationMode.None;

        if (totalFilesCount === 0) {
            folderDuplicationMode = FolderDuplicationMode.Empty;
        } else {
            const duplicatedFilesCount = duplicatedFilesCountMap.get(rootFolderId);

            if (!duplicatedFilesCount) {
                folderDuplicationMode = FolderDuplicationMode.None;
            } else if (totalFilesCount === duplicatedFilesCount) {
                folderDuplicationMode = FolderDuplicationMode.Full;
            } else {
                folderDuplicationMode = FolderDuplicationMode.Partial;
            }
        }

        return [rootFolderId, folderDuplicationMode];
    }));

    for (const childFolderId of folder.childFolderIds) {
        const childFolderDuplicationInfoMap = setFoldersDuplicationMode(
            foldersMap.get(childFolderId)!,
            secondaryRootFolderIds,
            comparisonResultMap,
            foldersMap);

        childFolderDuplicationInfoMap.forEach((childFolderDuplicationMode: FolderDuplicationMode, rootFolderId: number) => {
            let folderDuplicationMode = duplicationInfoMap.get(rootFolderId)!;

            if (childFolderDuplicationMode === FolderDuplicationMode.Full) {
                folderDuplicationMode = folderDuplicationMode === FolderDuplicationMode.Full || folderDuplicationMode === FolderDuplicationMode.Empty
                    ? FolderDuplicationMode.Full
                    : FolderDuplicationMode.Partial;
            }

            if (childFolderDuplicationMode === FolderDuplicationMode.Partial) {
                folderDuplicationMode = FolderDuplicationMode.Partial;
            }

            if (childFolderDuplicationMode === FolderDuplicationMode.None) {
                folderDuplicationMode = folderDuplicationMode === FolderDuplicationMode.None || folderDuplicationMode === FolderDuplicationMode.Empty
                    ? FolderDuplicationMode.None
                    : FolderDuplicationMode.Partial;
            }

            duplicationInfoMap.set(rootFolderId, folderDuplicationMode);
        });
    }

    folder.duplicationInfo = Array.from(duplicationInfoMap).map(([rootFolderId, duplicationMode]) => ({
        rootFolderId,
        duplicationMode
    }));

    return duplicationInfoMap;
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

    if (!primaryRootFolderDetails) {
        throw new NotFoundError();
    }

    const comparisonResultMap = new Map<number, ComparisonResultDuplicatedItemData[]>(
        (comparison.data as ComparisonResultData).map(item => ([item.fileId, item.duplicatedFiles]))
    );

    const foldersMap = new Map<number, ComparisonFolderItemModel>(primaryRootFolderDetails.folders.map(folder => [folder.id, {
        id: folder.id,
        name: folder.name,
        size: Number(folder.size),
        parentFolderId: folder.parentFolderId,
        childFileIds: folder.files.map(file => file.id),
        childFolderIds: folder.childFolders.map(childFolder => childFolder.id),
        duplicationInfo: []
    }]));

    const primaryFolder = primaryRootFolderDetails.folders.find(folder => folder.parentFolderId === null)!;
    const secondaryRootFolderIds = comparison.comparisonRootFolders
        .filter(comparisonRootFolder => !comparisonRootFolder.isPrimary)
        .map(comparisonRootFolder => comparisonRootFolder.rootFolder.id);

    setFoldersDuplicationMode(foldersMap.get(primaryFolder.id)!, secondaryRootFolderIds, comparisonResultMap, foldersMap);

    const totalDuplicatedFilesSize = primaryRootFolderDetails.files
        .filter(file => comparisonResultMap.has(file.id))
        .reduce((acc, file) => acc + Number(file.size), 0);

    // we should ignore cases when the same file is duplicated several times
    const processedFilesSet = new Set<string>();
    const totalDuplicatedFilesSizeByRootFolderId = primaryRootFolderDetails.files
        .filter(file => comparisonResultMap.has(file.id))
        .reduce((map, file) => {
            comparisonResultMap.get(file.id)!.forEach(duplicatedFile => {
                if (processedFilesSet.has(`${duplicatedFile.rootFolderId}-${duplicatedFile.fileId}`)) {
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
                processedFilesSet.add(`${duplicatedFile.rootFolderId}-${duplicatedFile.fileId}`);
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
            isDuplicated: comparisonResultMap.has(file.id),
            duplicatedRootFolderIds: Array.from(new Set(comparisonResultMap.get(file.id)?.map(item => item.rootFolderId) ?? []).keys())
        })),
        folders: Array.from(foldersMap.values())
    };
}
