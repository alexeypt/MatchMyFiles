import { CreateRootFolderModel } from '@/root-folder/data-access/commands/createRootFolderCommand';
import { UpdateRootFolderModel } from '@/root-folder/data-access/commands/updateRootFolderCommand';
import { RootFolderDetailsModel } from '@/root-folder/data-access/queries/getRootFolderQuery';


export default class RootFolderFormModel {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public folderPath: string
    ) {
        
    }

    static matToCreateModel(data: RootFolderFormModel): CreateRootFolderModel {
        return {
            name: data.name,
            description: data.description ?? null,
            folderPath: data.folderPath
        };
    }

    static mapToUpdateModel(data: RootFolderFormModel): UpdateRootFolderModel {
        return {
            id: data.id,
            name: data.name,
            description: data.description ?? null
        };
    }

    static init() {
        return new RootFolderFormModel(
            0,
            '',
            '',
            ''
        );
    }

    static mapFromRootFolderModel(source: RootFolderDetailsModel) {
        return new RootFolderFormModel(
            source.id,
            source.name,
            source.description ?? '',
            source.path
        );
    }
}
