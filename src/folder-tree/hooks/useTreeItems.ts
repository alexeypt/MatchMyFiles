import { useMemo } from "react";
import { TreeItem, TreeItemIndex } from "react-complex-tree";

import { getTreeKey } from "@/common/helpers/treeHelper";
import FileItemModel from "@/folder-tree/models/fileItemModel";
import FolderItemModel from "@/folder-tree/models/folderItemModel";
import FolderTreeOrdering from "@/folder-tree/models/folderTreeOrdering";
import TreeItemData from "@/folder-tree/models/treeItemData";
import TreeItemType from "@/folder-tree/models/treeItemType";


function getTreeFolderChildren(folder: FolderItemModel, ordering: FolderTreeOrdering, folderSizeMap: Map<number, number>, fileSizeMap: Map<number, number>) {
    if (ordering === FolderTreeOrdering.ByName) {
        return folder.childFolderIds.map(childFolderId => getTreeKey(childFolderId, 'folder'))
            .concat(folder.childFileIds.map(childFileId => getTreeKey(childFileId, 'file')));
    }

    return [...folder.childFolderIds]
        .sort((id1, id2) => folderSizeMap.get(id2)! - folderSizeMap.get(id1)!)
        .map(childFolderId => getTreeKey(childFolderId, 'folder'))
        .concat(
            [...folder.childFileIds]
                .sort((id1, id2) => fileSizeMap.get(id2)! - fileSizeMap.get(id1)!)
                .map(childFileId => getTreeKey(childFileId, 'file')
                )
        );
}

function getFolderWithAllChildrenMap<TFolder extends FolderItemModel>(rootItem: TFolder, foldersMap: Map<number, TFolder>) {
    const map = new Map<number, { files: number[], folders: number[] }>();

    function getFolderChildFilesAndFolders(folder: FolderItemModel) {
        const result = {
            files: [...folder.childFileIds],
            folders: [...folder.childFolderIds]
        };

        for (const childFolderId of folder.childFolderIds) {
            const folder = foldersMap.get(childFolderId);
            if (!folder) {
                continue;
            }

            const { files, folders } = getFolderChildFilesAndFolders(folder);

            result.files.push(...files);
            result.folders.push(...folders);
        }

        map.set(folder.id, result);

        return result;
    }

    getFolderChildFilesAndFolders(rootItem);

    return map;
}

export default function useTreeItems<TFolder extends FolderItemModel, TFile extends FileItemModel>(
    files: TFile[],
    folders: TFolder[],
    searchQuery: string,
    ordering: FolderTreeOrdering
) {
    const treeItems = useMemo(() => {
        const searchQueryLowerCase = searchQuery.toLowerCase();
        const fileSizeMap = new Map(files.map(file => ([file.id, file.size])));
        const folderSizeMap = new Map(folders.map(folder => ([folder.id, folder.size])));
        const foldersMap = new Map(folders.map(folder => ([folder.id, folder])));

        const foundFiles = files
            .filter(file => searchQuery ? file.fullName.toLowerCase().includes(searchQueryLowerCase) : true);
        const foundFileIds = new Set(foundFiles.map(item => item.id));

        const treeFileItems = foundFiles
            .reduce((result, file) => {
                result[getTreeKey(file.id, 'file')] = {
                    index: getTreeKey(file.id, 'file'),
                    data: {
                        type: TreeItemType.File,
                        title: file.fullName,
                        data: file
                    },
                    canMove: false,
                    canRename: false,
                    isFolder: false,
                    children: []
                };

                return result;
            }, {} as Record<TreeItemIndex, TreeItem<TreeItemData<TFolder, TFile>>>);

        const rootItem = folders.find(folder => !folder.parentFolderId)!;
        const folderWithAllChildrenMap = getFolderWithAllChildrenMap(rootItem, foldersMap);

        const foundFolderIds = new Set(folders
            .filter(folder => searchQueryLowerCase ? folder.name.toLowerCase().includes(searchQueryLowerCase) : true)
            .map(item => item.id));

        const treeFolderItems = folders
            .filter(folder => {
                if (!searchQueryLowerCase) {
                    return true;
                }

                const childItems = folderWithAllChildrenMap.get(folder.id)!;

                if (
                    folder.id === rootItem.id
                    || foundFolderIds.has(folder.id)
                    || childItems.files.some(item => foundFileIds.has(item))
                    || childItems.folders.some(item => foundFolderIds.has(item))
                ) {
                    return true;
                }

                return false;
            })
            .reduce((result, folder) => {
                result[getTreeKey(folder.id, 'folder')] = {
                    index: getTreeKey(folder.id, 'folder'),
                    data: {
                        type: TreeItemType.Folder,
                        title: folder.name,
                        data: folder
                    },
                    canMove: false,
                    canRename: false,
                    isFolder: true,
                    children: getTreeFolderChildren(folder, ordering, folderSizeMap, fileSizeMap)
                };

                return result;
            }, {} as Record<TreeItemIndex, TreeItem<TreeItemData<TFolder, TFile>>>);


        return {
            ...treeFileItems,
            ...treeFolderItems
        };
    }, [files, folders, ordering, searchQuery]);

    return treeItems;
}
