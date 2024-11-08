'use server';

import prismaClient from "@/common/helpers/prismaClient";

export interface UpdateRootFolderModel {
    id: number;
    name: string;
    description: string | null;
}

export default async function updateRootFolder(values: UpdateRootFolderModel) {
    const sourceGroup = await prismaClient.rootFolder.update({
        where: {
            id: values.id
        },
        data: {
            name: values.name,
            description: values.description
        }
    });

    return sourceGroup;
}
