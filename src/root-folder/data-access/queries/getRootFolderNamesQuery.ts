'use server';

import prismaClient from "@/common/helpers/prismaClient";


export interface RootFolderNameModel {
    id: number;
    name: string;
    path: string;
}

export default async function getRootFolderNamesQuery(): Promise<RootFolderNameModel[]> {
    const data = await prismaClient.rootFolder.findMany({
        orderBy: {
            createdAt: "asc"
        },
        select: {
            id: true,
            name: true,
            path: true
        }
    });

    return data;
}
