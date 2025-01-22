import FileItemModel from "@/folder-tree/models/fileItemModel";
import FolderItemModel from "@/folder-tree/models/folderItemModel";
import TreeItemType from "@/folder-tree/models/treeItemType";


interface TreeItemData<TFolder extends FolderItemModel, TFile extends FileItemModel> {
    type: TreeItemType;
    title: string;
    data: TFolder | TFile;
}

export default TreeItemData;
