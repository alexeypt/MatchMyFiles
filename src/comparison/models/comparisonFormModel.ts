import { CreateComparisonModel } from '@/comparison/data-access/commands/createComparison';
import { UpdateComparisonModel } from '@/comparison/data-access/commands/updateComparisonCommand';
import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';


export default class ComparisonFormModel {
    constructor(
        public id: number,
        public description: string,
        public primaryRootFolderId: string | null,
        public rootFolderIdsToCompareWith: string[]
    ) {

    }

    static matToCreateModel(data: ComparisonFormModel): CreateComparisonModel {
        return {
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
            description: data.description ?? null,
            primaryFolderId: +data.primaryRootFolderId!,
            folderIds: data.rootFolderIdsToCompareWith
                .map(rootFolderId => +rootFolderId)
                .filter(rootFolderId => !!rootFolderId && rootFolderId !== +data.primaryRootFolderId!)
        };
    }

    static init() {
        return new ComparisonFormModel(
            0,
            '',
            null,
            []
        );
    }

    static mapFromComparisonModel(comparison: ComparisonDetailsModel) {
        return new ComparisonFormModel(
            comparison.id,
            comparison.description ?? '',
            comparison.primaryRootFolder?.id.toString() ?? null,
            comparison.rootFolders.map(rootFolder => rootFolder.id.toString())
        );
    }
}
