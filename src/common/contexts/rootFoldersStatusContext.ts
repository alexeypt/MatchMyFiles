import React from 'react';

import RootFoldersStatusModel from '@/common/models/rootFoldersStatusModel';


export const RootFoldersStatusContext = React.createContext<RootFoldersStatusModel | null>(null);

export default RootFoldersStatusContext;
