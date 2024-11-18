enum SocketEventType {
    RootFolderProcessingStatus = 'rootFolder:processingStatus',
    RootFolderProcessingCompleted = 'rootFolder:processingCompleted',
    RootFolderProcessingFailed = 'rootFolder:processingFailed',
    ComparisonProcessingStarted = 'comparison:processingStarted',
    ComparisonProcessingCompleted = 'comparison:processingCompleted'
}

export default SocketEventType;
