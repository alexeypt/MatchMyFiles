import { useCallback, useState } from 'react';


export default function useModalControl(isOpenByDefault = false): [boolean, () => void, () => void] {
    const [isOpen, setIsOpen] = useState(isOpenByDefault);

    const showModal = useCallback(() => {
        setIsOpen(true);
    }, []);

    const hideModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return [isOpen, showModal, hideModal];
}
