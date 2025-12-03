'use server';

import prismaClient from '@/common/helpers/prismaClient';


export default async function removeRootFolder(id: number) {
    const rootFolder = await prismaClient.rootFolder.delete({
        where: {
            id
        }
    });

    return rootFolder;
}
