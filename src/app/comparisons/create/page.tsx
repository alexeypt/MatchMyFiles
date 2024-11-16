import { Metadata } from "next";

import ComparisonCreatePageContent from "@/comparison/components/ComparisonCreatePageContent";
import ComparisonCreatePageHeader from "@/comparison/components/ComparisonCreatePageHeader";
import getRootFolderNamesQuery from "@/root-folder/data-access/queries/getRootFolderNamesQuery";


export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
    title: "Match My Files > New Comparison"
};

export default async function ComparisonCreatePage() {
    const rootFolders = await getRootFolderNamesQuery();

    return (
        <>
            <ComparisonCreatePageHeader />
            <ComparisonCreatePageContent rootFolders={rootFolders} />
        </>
    );
}
