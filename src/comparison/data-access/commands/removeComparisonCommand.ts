'use server';

import prismaClient from '@/common/helpers/prismaClient';


export default async function removeComparison(id: number) {
    const comparison = await prismaClient.comparison.delete({
        where: {
            id
        }
    });

    return comparison;
}
