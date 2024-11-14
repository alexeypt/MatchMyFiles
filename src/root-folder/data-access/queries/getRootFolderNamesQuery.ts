'use server';

import { RootFolderProcessingStatus } from "@prisma/client";

import prismaClient from "@/common/helpers/prismaClient";


export interface RootFolderNameModel {
    id: number;
    name: string;
    path: string;
    size: number;
}

export default async function getRootFolderNamesQuery(): Promise<RootFolderNameModel[]> {
    const data = await prismaClient.rootFolder.findMany({
        orderBy: {
            createdAt: "asc"
        },
        where: {
            status: RootFolderProcessingStatus.Completed
        },
        select: {
            id: true,
            name: true,
            path: true,
            size: true
        }
    });

    return data.map(item => ({
        id: item.id,
        name: item.name,
        path: item.path,
        size: Number(item.size)
    }));
}
