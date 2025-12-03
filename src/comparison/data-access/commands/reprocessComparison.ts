'use server';

import { notFound } from 'next/navigation';

import prismaClient from '@/common/helpers/prismaClient';
import { ComparisonProcessingStatus } from '@/clients/prisma/client';
import { processComparison } from '@/comparison/data-access/commands/createComparison';


export default async function reprocessComparison(comparisonId: number) {
    const comparison = await prismaClient.comparison.findFirst({
        where: {
            id: comparisonId
        },
        select: {
            id: true,
            comparisonRootFolders: {
                select: {
                    isPrimary: true,
                    rootFolderId: true
                }
            }
        }
    });

    const primaryComparisonRootFolder = comparison?.comparisonRootFolders.find(comparisonRootFolder => comparisonRootFolder.isPrimary);

    if (!comparison || !primaryComparisonRootFolder) {
        notFound();
    }

    await prismaClient.comparison.update({
        where: {
            id: comparison.id
        },
        data: {
            status: ComparisonProcessingStatus.Processing
        }
    });

    await processComparison(
        primaryComparisonRootFolder.rootFolderId,
        comparison.comparisonRootFolders
            .filter(comparisonRootFolder => !comparisonRootFolder.isPrimary)
            .map(comparisonRootFolder => comparisonRootFolder.rootFolderId),
        comparison.id
    );

    return comparison;
}
