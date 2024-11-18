import { ReactNode, useCallback } from "react";
import { Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

import Heading from '@/common/components/Heading';
import useModalControl from "@/common/hooks/useModalControl";


interface ConfirmableButtonProps extends Omit<ButtonProps, 'onPress'> {
    confirmTitle: string;
    confirmDescription: ReactNode;
    confirmYesButtonLabel: string;
    confirmNoButtonLabel: string;
    hideConfirmYesButton?: boolean;
    hideConfirmNoButton?: boolean;
    confirmableYesButtonClassName?: string;
    confirmableNoButtonClassName?: string;
    isDisabledYesButton?: boolean;
    onPress: (hideModal: () => void) => void;
}

export default function ConfirmableButton({
    confirmTitle,
    confirmDescription,
    confirmYesButtonLabel,
    confirmNoButtonLabel,
    hideConfirmYesButton,
    hideConfirmNoButton,
    confirmableYesButtonClassName,
    confirmableNoButtonClassName,
    isDisabledYesButton,
    onPress,
    ...restProps
}: ConfirmableButtonProps) {
    const [isModalOpened, showModal, hideModal] = useModalControl();

    const onYesButtonClicked = useCallback(() => {
        onPress(hideModal);
    }, [hideModal, onPress]);

    return (
        <>
            <Button
                {...restProps}
                onPress={showModal}
            />
            <Modal
                isOpen={isModalOpened}
                size='lg'
                scrollBehavior="inside"
                onClose={hideModal}
            >
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>
                                <Heading level={2}>
                                    {confirmTitle}
                                </Heading>
                            </ModalHeader>
                            <ModalBody>
                                {confirmDescription}
                            </ModalBody>
                            <ModalFooter className="justify-between gap-5">
                                {
                                    !hideConfirmNoButton && (
                                        <Button
                                            color="danger"
                                            variant="bordered"
                                            className={confirmableNoButtonClassName}
                                            onPress={hideModal}
                                        >
                                            {confirmNoButtonLabel}
                                        </Button>
                                    )
                                }
                                {
                                    !hideConfirmYesButton && (
                                        <Button
                                            color="danger"
                                            className={confirmableYesButtonClassName}
                                            isDisabled={isDisabledYesButton}
                                            onPress={onYesButtonClicked}
                                        >
                                            {confirmYesButtonLabel}
                                        </Button>
                                    )
                                }
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
