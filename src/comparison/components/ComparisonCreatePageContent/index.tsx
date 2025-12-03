'use client';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { COMPARISON_EDIT_ROUTE } from '@/common/constants/routes';
import { action } from '@/common/helpers/actionHelper';
import { generateUrl } from '@/common/helpers/urlHelper';
import ComparisonForm from '@/comparison/components/ComparisonForm';
import createComparison from '@/comparison/data-access/commands/createComparison';
import ComparisonFormModel from '@/comparison/models/comparisonFormModel';
import { RootFolderNameModel } from '@/root-folder/data-access/queries/getRootFolderNamesQuery';


interface ComparisonCreatePageContentProps {
    rootFolders: RootFolderNameModel[];
}

export default function ComparisonCreatePageContent({ rootFolders }: ComparisonCreatePageContentProps) {
    const router = useRouter();

    const onSubmit = useCallback(async (data: ComparisonFormModel) => {
        const [isSuccess, comparison] = await action(async () => {
            return await createComparison(ComparisonFormModel.matToCreateModel(data));
        }, {
            successText: 'The Comparison has been successfully created',
            errorText: 'Failed to create the Comparison'
        });

        if (isSuccess && comparison) {
            router.push(generateUrl(COMPARISON_EDIT_ROUTE, { id: comparison.id }));

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
                initialValues={initialFormValues}
                isEditMode={false}
                onSubmit={onSubmit}
            />
        </article>
    );
}
