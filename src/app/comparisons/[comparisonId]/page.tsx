import { Metadata } from "next";

import ComparisonDetailsPageHeader from "@/comparison/components/ComparisonDetailsPageHeader";
import ComparisonGeneralInfoSection from "@/comparison/components/ComparisonGeneralInfoSection";
import ComparisonTreeSection from "@/comparison/components/ComparisonTreeSection";
import getComparison from "@/comparison/data-access/queries/getComparisonQuery";
import getRootFolderNamesQuery from "@/root-folder/data-access/queries/getRootFolderNamesQuery";
import PageSection from "@/common/components/PageSection";
import ComparisonRootFolderTable from "@/comparison/components/ComparisonRootFolderTable";


export const metadata: Metadata = {
    title: "Match My Files > Comparison Details"
};

export default async function ComparisonEditPage({ params }: { params: { comparisonId: string } }) {
    const [comparison, rootFolders] = await Promise.all([
        getComparison(+params.comparisonId),
        getRootFolderNamesQuery()
    ]);

    const comparisonRootFolders = [
        comparison.primaryRootFolder,
        ...comparison.rootFolders
    ];

    return (
        <>
            <ComparisonDetailsPageHeader comparison={comparison} />
            <article>
                <ComparisonGeneralInfoSection
                    rootFolders={rootFolders}
                    comparison={comparison}
                />
                <PageSection
                    title="Root Folders"
                    headingLevel={2}
                >
                    <ComparisonRootFolderTable data={comparisonRootFolders} />
                </PageSection>
                <ComparisonTreeSection comparison={comparison} />
            </article>
        </>
    );
}
