import { Metadata } from "next/types";

import RootFolderListPageHeader from "@/root-folder/components/RootFolderListPageHeader";
import RootFolderTable from "@/root-folder/components/RootFolderTable";
import getRootFolders from "@/root-folder/data-access/queries/getRootFoldersQuery";


export const metadata: Metadata = {
    title: "Match My Files > Root Folders"
};

export default async function RootFoldersPage() {
    const rootFolders = await getRootFolders();

    return (
        <>
            <RootFolderListPageHeader />
            <section>
                <RootFolderTable data={rootFolders} />
            </section>
        </>
    );
}
