import { Socket } from 'socket.io-client';

import SocketEventType from '@/common/types/socketEventType';
import SocketIOEventsMap from '@/common/types/socketIOEventsMap';


export interface ComparisonStatus {
    comparisonId: number;
    isFinished: boolean;
    isFailed: boolean;
}

export default class ComparisonsStatusModel {
    private processingComparisons: Set<number>;
    private comparisonFinishedEventListenersMap: Map<number, Set<() => void>>;

    constructor() {
        this.processingComparisons = new Set();
        this.comparisonFinishedEventListenersMap = new Map();
    }

    checkIsComparisonProcessing(comparisonId: number) {
        return this.processingComparisons.has(comparisonId);
    }

    init(socket: Socket<SocketIOEventsMap>) {
        socket.on(SocketEventType.ComparisonProcessingStarted, comparisonId => {
            this.processingComparisons.add(comparisonId);
        });

        socket.on(SocketEventType.ComparisonProcessingCompleted, comparisonId => {
            this.processingComparisons.delete(comparisonId);

            if (this.comparisonFinishedEventListenersMap.has(comparisonId)) {
                for (const callback of Array.from(this.comparisonFinishedEventListenersMap.get(comparisonId)!)) {
                    callback();
                }
            }
        });
    }

    attachComparisonFinishedEventListener(comparisonId: number, callback: () => void) {
        if (this.comparisonFinishedEventListenersMap.has(comparisonId)) {
            this.comparisonFinishedEventListenersMap.get(comparisonId)!.add(callback);
        } else {
            this.comparisonFinishedEventListenersMap.set(comparisonId, new Set([callback]));
        }

        return () => {
            this.comparisonFinishedEventListenersMap.get(comparisonId)?.delete(callback);
        };
    }
}
