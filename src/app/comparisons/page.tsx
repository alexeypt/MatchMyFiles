import { Metadata } from 'next/types';

import ComparisonListPageHeader from '@/comparison/components/ComparisonListPageHeader';
import ComparisonTable from '@/comparison/components/ComparisonTable';
import getComparisons from '@/comparison/data-access/queries/getComparisonsQuery';


export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
    title: 'Match My Files > Comparisons'
};

export default async function ComparisonsPage() {
    const comparisons = await getComparisons();

    return (
        <>
            <ComparisonListPageHeader />
            <section>
                <ComparisonTable data={comparisons} />
            </section>
        </>
    );
}
