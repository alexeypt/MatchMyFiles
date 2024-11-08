'use client';

import { ReactNode, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { NextUIProvider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

import RootFoldersStatusContext from '@/common/contexts/rootFoldersStatusContext';
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

    const [rootFolderStatusModel, setRootFolderStatusModel] = useState<RootFoldersStatusModel | null>(null);

    useEffect(() => {
        // Create a socket connection
        const socket: Socket<SocketIOEventsMap> = io();

        const rootFolderStatusModel = new RootFoldersStatusModel();
        rootFolderStatusModel.init(socket);

        setRootFolderStatusModel(rootFolderStatusModel);

        // Clean up the socket connection on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <NextUIProvider navigate={router.push}>
            <RootFoldersStatusContext.Provider value={rootFolderStatusModel}>
                {children}
                <ToastContainer />
            </RootFoldersStatusContext.Provider>
        </NextUIProvider>
    );
}
