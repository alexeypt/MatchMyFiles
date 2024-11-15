'use server';

import prismaClient from "@/common/helpers/prismaClient";
import NotFoundError from "@/common/models/notFoundError";
import reprocessRootFolder from "@/root-folder/data-access/commands/reprocessRootFolderCommand";

export interface UpdateRootFolderModel {
    id: number;
    name: string;
    description: string | null;
    folderPath: string;
}

export default async function updateRootFolder(values: UpdateRootFolderModel) {
    const rootFolder = await prismaClient.rootFolder.findFirst({
        where: {
            id: values.id
        },
        select: {
            path: true
        }
    });

    if (!rootFolder) {
        throw new NotFoundError();
    }

    const updatedRootFolder = await prismaClient.rootFolder.update({
        where: {
            id: values.id
        },
        data: {
            name: values.name,
            description: values.description,
            path: values.folderPath
        }
    });

    const isReprocessingRequired = rootFolder.path !== updatedRootFolder.path;

    if (isReprocessingRequired) {
        await reprocessRootFolder(updatedRootFolder.id);
    }

    return {
        id: updateRootFolder,
        isReprocessingRequired
    };
}
