'use server';

import { ComparisonProcessingStatus } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";
import NotFoundError from "@/common/models/notFoundError";
import FolderDuplicationMode from "@/comparison/models/folderDuplicationMode";
import { ComparisonResultData } from "@/comparison/types/comparisonResultData";


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
    id: number;
    name: string;
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
    const hasAnyDuplicate = folder.childFolderIds.some(fileId => filesMap.get(fileId));

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
                            name: true
                        }
                    }
                }
            }
        }
    });

    if (!comparison || !comparison.comparisonRootFolders.some(comparisonRootFolder => comparisonRootFolder.isPrimary)) {
        throw new NotFoundError();
    }

    const primaryRootFolder = comparison.comparisonRootFolders.find(comparisonRootFolder => comparisonRootFolder.isPrimary)!.rootFolder;

    const rootFolder = await prismaClient.rootFolder.findFirst({
        where: {
            id: primaryRootFolder.id
        },
        select: {
            id: true,
            name: true,
            description: true,
            path: true,
            status: true,
            createdAt: true,
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

    if (!rootFolder) {
        throw new NotFoundError();
    }

    const comparisonResultMap = new Map<number, number[]>((comparison.data as ComparisonResultData).map(item => ([item.fileId, item.duplicatedFileIds])));

    const foldersMap = new Map<number, ComparisonFolderItemModel>(rootFolder.folders.map(folder => [folder.id, {
        id: folder.id,
        name: folder.name,
        parentFolderId: folder.parentFolderId,
        childFileIds: folder.files.map(file => file.id),
        childFolderIds: folder.childFolders.map(childFolder => childFolder.id),
        duplicationMode: FolderDuplicationMode.None
    }]));
    const filesMap = new Map<number, boolean>(rootFolder.files.map(file => [file.id, comparisonResultMap.has(file.id)]));

    const primaryFolder = rootFolder.folders.find(folder => folder.parentFolderId === null)!;

    setFoldersDuplicationMode(foldersMap.get(primaryFolder.id)!, filesMap, foldersMap);

    return {
        id: comparison.id,
        name: comparison.name,
        description: comparison.description,
        status: comparison.status,
        createdAt: comparison.createdAt,
        primaryRootFolder,
        rootFolders: comparison.comparisonRootFolders
            .filter(comparisonRootFolder => !comparisonRootFolder.isPrimary)
            .map(comparisonRootFolder => comparisonRootFolder.rootFolder),
        files: rootFolder.files.map(file => ({
            id: file.id,
            fullName: file.fullName,
            size: Number(file.size),
            isDuplicated: comparisonResultMap.has(file.id)
        })),
        folders: Array.from(foldersMap.values())
    };
}
