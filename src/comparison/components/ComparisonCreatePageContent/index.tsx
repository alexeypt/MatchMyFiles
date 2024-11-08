'use client';

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";

import { COMPARISON_ROUTE } from "@/common/constants/routes";
import { action } from "@/common/helpers/actionHelper";
import ComparisonForm from "@/comparison/components/ComparisonForm";
import createComparison from "@/comparison/data-access/commands/createComparison";
import ComparisonFormModel from "@/comparison/models/comparisonFormModel";
import { RootFolderNameModel } from "@/root-folder/data-access/queries/getRootFolderNamesQuery";


interface ComparisonCreatePageContentProps {
    rootFolders: RootFolderNameModel[];
}

export default function ComparisonCreatePageContent({ rootFolders }: ComparisonCreatePageContentProps) {
    const router = useRouter();

    const onSubmit = useCallback(async (data: ComparisonFormModel) => {
        const [isSuccess] = await action(async () => {
            await createComparison(ComparisonFormModel.matToCreateModel(data));
        }, {
            successText: 'The Comparison has been successfully created',
            errorText: 'Failed to create the Comparison'
        });

        if (isSuccess) {
            router.push(COMPARISON_ROUTE);

            router.refresh();
        }

    }, [router]);

    const initialFormValues: ComparisonFormModel = useMemo(() => {
        return ComparisonFormModel.init();
    }, []);

    return (
        <article>
            <ComparisonForm
                rootFolders={rootFolders}
                onSubmit={onSubmit}
                initialValues={initialFormValues}
                isEditMode={false}
            />
        </article>
    );
}
