import { ComparisonProcessingStatus, RootFolderProcessingStatus } from "@prisma/client";
import { Metadata } from "next";

import Heading from "@/common/components/Heading";
import PageSection from "@/common/components/PageSection";
import ComparisonDetailsPageHeader from "@/comparison/components/ComparisonDetailsPageHeader";
import ComparisonGeneralInfoSection from "@/comparison/components/ComparisonGeneralInfoSection";
import ComparisonProgressBar from "@/comparison/components/ComparisonProgeressBar";
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

    const rootFolderColorMap = new Map<number, string>(comparisonRootFolders.map((rootFolder, index) => ([
        rootFolder.id,
        COMPARISON_ROOT_FOLDER_COLORS[index % COMPARISON_ROOT_FOLDER_COLORS.length]
    ])));

    const isProcessing = comparison.status === ComparisonProcessingStatus.Processing
        || comparisonRootFolders.some(comparisonRootFolder => comparisonRootFolder.status === RootFolderProcessingStatus.Processing);

    return (
        <>
            <ComparisonDetailsPageHeader comparison={comparison} />
            <article>
                <ComparisonGeneralInfoSection
                    rootFolders={rootFolders}
                    comparison={comparison}
                />
                {
                    comparison.status === ComparisonProcessingStatus.Completed && !isProcessing && (
                        <>
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
                        </>
                    )
                }
                {
                    isProcessing && <ComparisonProgressBar comparison={comparison} />
                }
                {
                    comparison.status === ComparisonProcessingStatus.Failed && !isProcessing &&
                    (
                        <div className="flex flex-col gap-10">
                            <Heading
                                level={2}
                                className="text-5xl font-serif text-red-900"
                            >
                                Something went wrong!
                            </Heading>
                            <p className="text-3xl font-serif">
                                Comparison can&apos;t be processed.
                                Please, check Root Folders used in comparison and their statuses.
                            </p>
                        </div>
                    )
                }
            </article>
        </>
    );
}
