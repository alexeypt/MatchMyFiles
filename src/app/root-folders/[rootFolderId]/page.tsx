import { Metadata } from "next";

import Heading from "@/common/components/Heading";
import { RootFolderProcessingStatus } from "@/clients/prisma/client";
import RootFolderDetailsPageHeader from "@/root-folder/components/RootFolderDetailsPageHeader";
import RootFolderGeneralInfoSection from "@/root-folder/components/RootFolderGeneralInfoSection";
import RootFolderProgressBar from "@/root-folder/components/RootFolderProgressBar";
import RootFolderSelfDuplicationSection from "@/root-folder/components/RootFolderSelfDuplicationSection";
import RootFolderTreeSection from "@/root-folder/components/RootFolderTreeSection";
import getRootFolder from "@/root-folder/data-access/queries/getRootFolderQuery";


export const metadata: Metadata = {
    title: "Match My Files > Root Folder Details"
};

export default async function RootFolderEditPage(props: { params: Promise<{ rootFolderId: string }> }) {
    const params = await props.params;
    const rootFolder = await getRootFolder(+params.rootFolderId);

    return (
        <>
            <RootFolderDetailsPageHeader rootFolder={rootFolder} />
            <article>
                <RootFolderGeneralInfoSection rootFolder={rootFolder} />
                {
                    rootFolder.status === RootFolderProcessingStatus.Completed &&
                    <>
                        <RootFolderTreeSection rootFolder={rootFolder} />
                        {
                            rootFolder.duplicationData.length > 0 && (
                                <RootFolderSelfDuplicationSection duplicationData={rootFolder.duplicationData} />
                            )
                        }
                    </>
                }
                {
                    rootFolder.status === RootFolderProcessingStatus.Processing &&
                    <RootFolderProgressBar rootFolder={rootFolder} />
                }
                {
                    rootFolder.status === RootFolderProcessingStatus.Failed &&
                    (
                        <div className="flex flex-col gap-10">
                            <Heading
                                level={2}
                                className="text-4xl font-serif text-red-900"
                            >
                                Something went wrong!
                            </Heading>
                            <p className="text-2xl font-serif">Root Folder can&apos;t be processed. Please, check that folder path is correct.</p>
                        </div>
                    )
                }
            </article>
        </>
    );
}
