import SocketEventType from "@/common/types/socketEventType";


type SocketIOEventsMap = {
    [SocketEventType.RootFolderProcessingStatus]: (rootFolderId: number, statusPercent: number, message: string | null) => void;
    [SocketEventType.RootFolderProcessingCompleted]: (rootFolderId: number, rootFolderName: string) => void;
    [SocketEventType.RootFolderProcessingFailed]: (rootFolderId: number, rootFolderName: string) => void;
    [SocketEventType.ComparisonProcessingStarted]: (comparisonId: number) => void;
    [SocketEventType.ComparisonProcessingCompleted]: (comparisonId: number) => void;
}

export default SocketIOEventsMap;
