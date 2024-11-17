import React from 'react';

import ComparisonsStatusModel from '@/common/models/comparisonsStatusModel';
import RootFoldersStatusModel from '@/common/models/rootFoldersStatusModel';


export interface SocketContextModel {
    rootFoldersStatus: RootFoldersStatusModel;
    comparisonsStatus: ComparisonsStatusModel;
}

const SocketContext = React.createContext<SocketContextModel | null>(null);

export default SocketContext;
