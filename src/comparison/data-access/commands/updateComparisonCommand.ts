'use server';

import prismaClient from "@/common/helpers/prismaClient";

export interface UpdateComparisonModel {
    id: number;
    name: string;
    description: string | null;
}

export default async function updateComparison(values: UpdateComparisonModel) {
    const comparison = await prismaClient.comparison.update({
        where: {
            id: values.id
        },
        data: {
            name: values.name,
            description: values.description
        }
    });

    return comparison;
}
