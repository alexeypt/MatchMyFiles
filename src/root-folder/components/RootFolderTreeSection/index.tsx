"use client";

import React, { useMemo } from 'react';
import { StaticTreeDataProvider, Tree, TreeItem, TreeItemIndex, UncontrolledTreeEnvironment } from 'react-complex-tree';

import PageSection from '@/common/components/PageSection';
import { RootFolderDetailsModel, RootFolderFileItemModel, RootFolderFolderItemModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


interface RootFolderTreeSectionProps {
    rootFolder: RootFolderDetailsModel;
}

export default function RootFolderTreeSection({ rootFolder }: RootFolderTreeSectionProps) {
    const dataProvider = useMemo(() => {
        let items = rootFolder.files.reduce((result, file) => {
            result[`file-${file.id}`] = {
                index: `file-${file.id}`,
                data: file,
                canMove: false,
                canRename: false,
                isFolder: false,
                children: []
            };

            return result;
        }, {} as Record<TreeItemIndex, TreeItem<RootFolderFolderItemModel | RootFolderFileItemModel>>);

        items = rootFolder.folders.reduce((result, folder) => {
            result[`folder-${folder.id}`] = {
                index: `folder-${folder.id}`,
                data: folder,
                canMove: false,
                canRename: false,
                isFolder: true,
                children: folder.childFileIds.map(childFileId => `file-${childFileId}`).concat(folder.childFolderIds.map(childFolderId => `folder-${childFolderId}`))
            };

            return result;
        }, items);

        return new StaticTreeDataProvider(items);
    }, [rootFolder.files, rootFolder.folders]);

    const rootItem = rootFolder.folders.find(folder => !folder.parentFolderId)!;

    return (
        <PageSection
            title="Files Tree"
            headingLevel={2}
        >
            <div className="flex flex-col gap-9">
                <UncontrolledTreeEnvironment
                    dataProvider={dataProvider}
                    getItemTitle={item => item.data.name ?? item.data.fullName}
                    canSearch
                    renderDepthOffset={40}
                    renderItemTitle={({ item, title }) => {
                        // TODO: move to a separate component
                        return (
                            <div className="flex justify-between w-full pt-1 pb-1 pl-2">
                                <div>
                                    {title}
                                </div>
                                <div>
                                    {item.data?.size}
                                </div>
                            </div>
                        );
                    }}
                            canSearchByStartingTyping
                            viewState={{}}
                >
                            <Tree
                                treeId="tree-2" // TODO: update tree id
                                rootItem={`folder-${rootItem.id}`}
                                treeLabel="Files and Folders Tree"
                            />
                        </UncontrolledTreeEnvironment>
            </div>
        </PageSection>
    );
}
