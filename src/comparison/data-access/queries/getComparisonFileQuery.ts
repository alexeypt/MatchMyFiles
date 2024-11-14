'use server';

import prismaClient from "@/common/helpers/prismaClient";
import NotFoundError from "@/common/models/notFoundError";
import { ComparisonResultData, ComparisonResultDuplicatedItemData } from "@/comparison/types/comparisonResultData";


export interface ComparisonFileDetailsModel {
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
    isDuplicated: boolean;
    duplicationInfo: {
        rootFolderId: number;
        rootFolderName: string;
        rootFolderPath: string;
        fileId: number;
        fullName: string;
        absolutePath: string;
    }[];
}

export default async function getComparisonFile(comparisonId: number, fileId: number): Promise<ComparisonFileDetailsModel> {
    const file = await prismaClient.file.findFirst({
        where: {
            id: fileId
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

    const comparisonResultMap = new Map<number, ComparisonResultDuplicatedItemData[]>((comparison.data as ComparisonResultData)
        .map(item => ([item.fileId, item.duplicatedFiles]))
    );
    const fileComparisonResults = comparisonResultMap.get(file.id);

    let duplicationInfo: ComparisonFileDetailsModel['duplicationInfo'] = [];

    if (fileComparisonResults) {
        const fileIds = fileComparisonResults.map(item => item.fileId);

        const files = await prismaClient.file.findMany({
            where: {
                id: {
                    in: fileIds
                }
            },
            select: {
                id: true,
                fullName: true,
                absolutePath: true,
                rootFolder: {
                    select: {
                        id: true,
                        name: true,
                        path: true
                    }
                }
            }
        });

        duplicationInfo = files.map(file => ({
            rootFolderId: file.rootFolder.id,
            rootFolderName: file.rootFolder.name,
            rootFolderPath: file.rootFolder.path,
            fileId: file.id,
            fullName: file.fullName,
            absolutePath: file.absolutePath
        }));
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
        fileContentModifiedDate: file.fileContentModifiedDate,
        isDuplicated: !!fileComparisonResults,
        duplicationInfo
    };
}
