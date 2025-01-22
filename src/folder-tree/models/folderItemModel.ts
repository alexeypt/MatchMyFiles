interface FolderItemModel {
    id: number;
    name: string;
    size: number;
    childFolderIds: number[];
    childFileIds: number[];
    parentFolderId: number | null;
}

export default FolderItemModel;
