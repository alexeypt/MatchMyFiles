type SocketIOEventsMap = {
    ['rootFolder:processingStatus']: (rootFolderId: number, statusPercent: number, message: string | null) => void;
    ['rootFolder:processingCompleted']: (rootFolderId: number) => void;
}

export default SocketIOEventsMap;
