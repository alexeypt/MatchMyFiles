import { toast } from 'react-toastify';
import { Link } from '@heroui/link';
import { Socket } from 'socket.io-client';

import { ROOT_FOLDER_EDIT_ROUTE } from '@/common/constants/routes';
import { generateUrl } from '@/common/helpers/urlHelper';
import SocketEventType from '@/common/types/socketEventType';
import SocketIOEventsMap from '@/common/types/socketIOEventsMap';


export interface RootFolderStatus {
    rootFolderId: number;
    percentStatus: number;
    message: string | null;
    isFinished: boolean;
    isFailed: boolean;
}

export default class RootFoldersStatusModel {
    private rootFolderStatusMap: Map<number, RootFolderStatus>;
    private eventListenersMap: Map<number, Set<(status: RootFolderStatus) => void>>;
    private genericListeners: Set<(status: RootFolderStatus) => void>;

    constructor() {
        this.rootFolderStatusMap = new Map();
        this.eventListenersMap = new Map();
        this.genericListeners = new Set();
    }

    init(socket: Socket<SocketIOEventsMap>) {
        socket.on(SocketEventType.RootFolderProcessingStatus, (rootFolderId, percentStatus, message) => {
            const rootFolderStatus = {
                rootFolderId,
                percentStatus,
                message,
                isFinished: false,
                isFailed: false
            };

            this.rootFolderStatusMap.set(rootFolderId, rootFolderStatus);
            this.notifyEventListeners(rootFolderId, rootFolderStatus);
        });

        socket.on(SocketEventType.RootFolderProcessingCompleted, (rootFolderId, rootFolderName) => {
            const rootFolderStatus: RootFolderStatus = {
                isFinished: true,
                isFailed: false,
                percentStatus: 100,
                rootFolderId,
                message: 'Completed'
            };

            this.rootFolderStatusMap.set(rootFolderId, rootFolderStatus);
            this.notifyEventListeners(rootFolderId, rootFolderStatus);

            const rootFolderUrl = generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: rootFolderId });
            toast.success(
                <p>
                    <Link href={rootFolderUrl}>
                        <span className="font-bold">{rootFolderName} Root Folder</span>
                    </Link> has been processed successfully
                </p>
            );
        });

        socket.on(SocketEventType.RootFolderProcessingFailed, (rootFolderId, rootFolderName) => {
            const item = this.rootFolderStatusMap.get(rootFolderId);

            const rootFolderStatus: RootFolderStatus = {
                isFinished: true,
                isFailed: true,
                percentStatus: item?.percentStatus ?? 0,
                rootFolderId,
                message: 'Failed'
            };

            this.rootFolderStatusMap.set(rootFolderId, rootFolderStatus);
            this.notifyEventListeners(rootFolderId, rootFolderStatus);

            const rootFolderUrl = generateUrl(ROOT_FOLDER_EDIT_ROUTE, { id: rootFolderId });
            toast.error(
                <p>
                    Failed to process&nbsp;
                    <Link href={rootFolderUrl}>
                        <span className="font-bold">{rootFolderName} Root Folder</span>
                    </Link>
                </p>
            );
        });
    }

    attachGenericEventListener(callback: (status: RootFolderStatus) => void) {
        this.genericListeners.add(callback);

        return () => {
            this.genericListeners.delete(callback);
        };
    }

    attachEventListener(rootFolderId: number, callback: (status: RootFolderStatus) => void) {
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

    private notifyEventListeners(rootFolderId: number, rootFolderStatus: RootFolderStatus) {
        if (this.eventListenersMap.has(rootFolderId)) {
            for (const callback of Array.from(this.eventListenersMap.get(rootFolderId)!)) {
                callback(rootFolderStatus);
            }
        }

        for (const callback of Array.from(this.genericListeners)) {
            callback(rootFolderStatus);
        }
    }
}
