import { ComparisonProcessingStatus, RootFolderProcessingStatus } from "@/clients/prisma/client";


export function getComparisonStatus(comparisonStatus: ComparisonProcessingStatus, rootFolderStatuses: RootFolderProcessingStatus[]) {
    let resultStatus = comparisonStatus;

    if (rootFolderStatuses.some(status => status === RootFolderProcessingStatus.Failed)) {
        resultStatus = ComparisonProcessingStatus.Failed;
    }
    if (rootFolderStatuses.some(status => status === RootFolderProcessingStatus.Processing)) {
        resultStatus = ComparisonProcessingStatus.Processing;
    }

    return resultStatus;
}
