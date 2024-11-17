import { Link } from "@nextui-org/react";
import { ComparisonProcessingStatus, RootFolderProcessingStatus } from "@prisma/client";
import { Metadata } from "next";

import Heading from "@/common/components/Heading";
import PageSection from "@/common/components/PageSection";
import { ROOT_FOLDER_EDIT_ROUTE } from "@/common/constants/routes";
import { generateUrl } from "@/common/helpers/urlHelper";
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

    return (
        <>
            <ComparisonDetailsPageHeader comparison={comparison} />
            <article>
                <ComparisonGeneralInfoSection
                    rootFolders={rootFolders}
                    comparison={comparison}
                />
                {
                    comparison.status === ComparisonProcessingStatus.Completed && (
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
                    comparison.status === ComparisonProcessingStatus.Processing && <ComparisonProgressBar comparison={comparison} />
                }
                {
                    comparison.status === ComparisonProcessingStatus.Failed &&
                    (
                        <div className="flex flex-col gap-10">
                            <Heading
                                level={2}
                                className="text-4xl font-serif text-red-900"
                            >
                                Something went wrong!
                            </Heading>
                            <div className="text-2xl font-serif">
                                Comparison can&apos;t be processed.
                                The following Root Folders have <span className="text-red-900 font-bold">Failed</span> status:
                                <ul className="list-disc ml-10 mt-2">
                                    {
                                        comparisonRootFolders
                                            .filter(comparisonRootFolder => comparisonRootFolder.status === RootFolderProcessingStatus.Failed)
                                            .map(comparisonRootFolder => (
                                                <li key={comparisonRootFolder.id}>
                                                    <Link
                                                        href={generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: comparisonRootFolder.id })}
                                                        className="text-lg"
                                                    >
                                                        {comparisonRootFolder.name} ({comparisonRootFolder.path})
                                                    </Link>
                                                </li>
                                            ))
                                    }
                                </ul>
                            </div>
                        </div>
                    )
                }
            </article>
        </>
    );
}
