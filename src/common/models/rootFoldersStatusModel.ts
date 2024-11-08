import { Socket } from 'socket.io-client';

import SocketIOEventsMap from '@/common/types/socketIOEventsMap';


export interface RootFolderStatus {
    percentStatus: number;
    message: string | null;
}

export default class RootFoldersStatusModel {
    private rootFolderStatusMap: Map<number, RootFolderStatus>;
    private eventListenersMap: Map<number, Set<(status: RootFolderStatus | null) => void>>;

    constructor() {
        this.rootFolderStatusMap = new Map();
        this.eventListenersMap = new Map();
    }

    init(socket: Socket<SocketIOEventsMap>) {
        socket.on('rootFolder:processingStatus', (rootFolderId, percentStatus, message) => {
            const rootFolderStatus = {
                percentStatus,
                message
            };
            this.rootFolderStatusMap.set(rootFolderId, rootFolderStatus);

            this.notifyEventListeners(rootFolderId, rootFolderStatus);
        });

        socket.on('rootFolder:processingCompleted', rootFolderId => {
            if (this.rootFolderStatusMap.has(rootFolderId)) {
                this.rootFolderStatusMap.delete(rootFolderId);
            }

            this.notifyEventListeners(rootFolderId, null);
        });

    }

    attachEventListener(rootFolderId: number, callback: (status: RootFolderStatus | null) => void) {
        if (this.eventListenersMap.has(rootFolderId)) {
            this.eventListenersMap.get(rootFolderId)!.add(callback);
        } else {
            this.eventListenersMap.set(rootFolderId, new Set([callback]));
        }

        return () => {
            this.eventListenersMap.get(rootFolderId)?.delete(callback);
        };
    }

    getRootFolderStatus(rootFolderId: number) {
        return this.rootFolderStatusMap.get(rootFolderId) ?? null;
    }

    private notifyEventListeners(rootFolderId: number, rootFolderStatus: RootFolderStatus | null) {
        if (this.eventListenersMap.has(rootFolderId)) {
            for (const callback of Array.from(this.eventListenersMap.get(rootFolderId)!)) {
                callback(rootFolderStatus);
            }
        }
    }
}
