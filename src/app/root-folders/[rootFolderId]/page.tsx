import { RootFolderProcessingStatus } from "@prisma/client";
import { Metadata } from "next";

import RootFolderDetailsPageHeader from "@/root-folder/components/RootFolderDetailsPageHeader";
import RootFolderGeneralInfoSection from "@/root-folder/components/RootFolderGeneralInfoSection";
import RootFolderProgressBar from "@/root-folder/components/RootFolderProgeressBar";
import RootFolderSelfDuplicationSection from "@/root-folder/components/RootFolderSelfDuplicationSection";
import RootFolderTreeSection from "@/root-folder/components/RootFolderTreeSection";
import getRootFolder from "@/root-folder/data-access/queries/getRootFolderQuery";


export const metadata: Metadata = {
    title: "Match My Files > Root Folder Details"
};

export default async function RootFolderEditPage({ params }: { params: { rootFolderId: string } }) {
    const rootFolder = await getRootFolder(+params.rootFolderId);

    return (
        <>
            <RootFolderDetailsPageHeader rootFolder={rootFolder} />
            <article>
                <RootFolderGeneralInfoSection rootFolder={rootFolder} />
                {
                    rootFolder.status === RootFolderProcessingStatus.Completed &&
                    <>
                        {
                            rootFolder.duplicationData.length > 0 && (
                                <RootFolderSelfDuplicationSection duplicationData={rootFolder.duplicationData} />
                            )
                        }
                        <RootFolderTreeSection rootFolder={rootFolder} />
                    </>
                }
                {
                    rootFolder.status === RootFolderProcessingStatus.Processing &&
                    <RootFolderProgressBar rootFolder={rootFolder} />
                }
            </article>
        </>
    );
}
