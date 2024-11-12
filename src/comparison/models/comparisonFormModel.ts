import { CreateComparisonModel } from '@/comparison/data-access/commands/createComparison';
import { UpdateComparisonModel } from '@/comparison/data-access/commands/updateComparisonCommand';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';


export default class ComparisonFormModel {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public primaryRootFolderId: string | null,
        public rootFolderIdsToCompareWith: string[]
    ) {
        
    }

    static matToCreateModel(data: ComparisonFormModel): CreateComparisonModel {
        return {
            name: data.name,
            description: data.description ?? null,
            primaryFolderId: +data.primaryRootFolderId!,
            folderIds: data.rootFolderIdsToCompareWith
                .map(rootFolderId => +rootFolderId)
                .filter(rootFolderId => !!rootFolderId && rootFolderId !== +data.primaryRootFolderId!)
        };
    }

    static mapToUpdateModel(data: ComparisonFormModel): UpdateComparisonModel {
        return {
            id: data.id,
            name: data.name,
            description: data.description ?? null
        };
    }

    static init() {
        return new ComparisonFormModel(
            0,
            '',
            '',
            null,
            []
        );
    }

    static mapFromComparisonModel(source: ComparisonDetailsModel) {
        return new ComparisonFormModel(
            source.id,
            source.name,
            source.description ?? '',
            source.primaryRootFolder?.id.toString() ?? null,
            source.rootFolders.map(rootFolder => rootFolder.id.toString())
        );
    }
}
