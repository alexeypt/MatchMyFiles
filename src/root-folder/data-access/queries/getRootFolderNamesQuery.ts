'use server';

import prismaClient from '@/common/helpers/prismaClient';
import { RootFolderProcessingStatus } from '@/clients/prisma/client';


export interface RootFolderNameModel {
    id: number;
    name: string;
    path: string;
    size: number;
}

export default async function getRootFolderNamesQuery(statuses?: RootFolderProcessingStatus[]): Promise<RootFolderNameModel[]> {
    const data = await prismaClient.rootFolder.findMany({
        orderBy: {
            createdAt: 'asc'
        },
        where: {
            status: {
                in: statuses
            }
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
