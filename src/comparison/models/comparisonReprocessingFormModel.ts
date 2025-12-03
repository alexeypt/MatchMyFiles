import { ComparisonDetailsModel } from '@/comparison/data-access/queries/getComparisonQuery';


export default class ComparisonReprocessingFormModel {
    constructor(
        public comparisonId: number,
        public rootFolderIds: number[],
        public rootFolderIdsToReprocess: string[]
    ) {

    }

    static mapFromComparisonModel(comparison: ComparisonDetailsModel) {
        return new ComparisonReprocessingFormModel(
            comparison.id,
            [
                comparison.primaryRootFolder.id,
                ...comparison.rootFolders.map(rootFolder => rootFolder.id)
            ],
            []
        );
    }
}
