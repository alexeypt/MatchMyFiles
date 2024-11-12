export type ComparisonResultDuplicatedItemData = {
    rootFolderId: number;
    fileId: number;
}

export type ComparisonResultItemData = {
    fileId: number;
    duplicatedFiles: ComparisonResultDuplicatedItemData[];
}

export type ComparisonResultData = ComparisonResultItemData[];
