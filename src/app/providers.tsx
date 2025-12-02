'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

import SocketContext, { SocketContextModel } from '@/common/contexts/socketContext';
import ComparisonsStatusModel from '@/common/models/comparisonsStatusModel';
import RootFoldersStatusModel from '@/common/models/rootFoldersStatusModel';
import SocketIOEventsMap from '@/common/types/socketIOEventsMap';

import 'react-toastify/dist/ReactToastify.min.css';


interface ProviderProps {
    children: ReactNode;
}

export function Providers({
    children
}: ProviderProps) {
    const router = useRouter();

    const [socketContextModel, setSocketContextModel] = useState<SocketContextModel | null>(null);

    useEffect(() => {
        const socket: Socket<SocketIOEventsMap> = io();

        const rootFolderStatusModel = new RootFoldersStatusModel();
        const comparisonStatusModel = new ComparisonsStatusModel();
        rootFolderStatusModel.init(socket);
        comparisonStatusModel.init(socket);

        setSocketContextModel({
            comparisonsStatus: comparisonStatusModel,
            rootFoldersStatus: rootFolderStatusModel
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <HeroUIProvider navigate={router.push}>
            <SocketContext.Provider value={socketContextModel}>
                {children}
                <ToastContainer autoClose={3000} />
            </SocketContext.Provider>
        </HeroUIProvider>
    );
}
