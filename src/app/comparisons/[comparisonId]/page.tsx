import { Metadata } from "next";

import PageSection from "@/common/components/PageSection";
import ComparisonDetailsPageHeader from "@/comparison/components/ComparisonDetailsPageHeader";
import ComparisonGeneralInfoSection from "@/comparison/components/ComparisonGeneralInfoSection";
import ComparisonRootFolderTable from "@/comparison/components/ComparisonRootFolderTable";
import ComparisonTreeSection from "@/comparison/components/ComparisonTreeSection";
import COMPARISON_ROOT_FOLDER_COLORS from "@/comparison/constants/colors";
import getComparison from "@/comparison/data-access/queries/getComparisonQuery";
import getRootFolderNamesQuery from "@/root-folder/data-access/queries/getRootFolderNamesQuery";


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

    const rootFolderColorMap = new Map<number, string>(comparison.rootFolders.map((rootFolder, index) => [
        rootFolder.id,
        COMPARISON_ROOT_FOLDER_COLORS[index % COMPARISON_ROOT_FOLDER_COLORS.length]
    ]));

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
                    <ComparisonRootFolderTable
                        data={comparisonRootFolders}
                        rootFolderColorMap={rootFolderColorMap}
                    />
                </PageSection>
                <ComparisonTreeSection
                    comparison={comparison}
                    rootFolderColorMap={rootFolderColorMap}
                />
            </article>
        </>
    );
}
