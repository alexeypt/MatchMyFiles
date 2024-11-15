import { ReactNode } from "react";
import { Button, ButtonProps, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

import Heading from '@/common/components/Heading';
import useModalControl from "@/common/hooks/useModalControl";


interface ConfirmableButtonProps extends ButtonProps {
    confirmTitle: string;
    confirmDescription: ReactNode;
    confirmYesButtonLabel: string;
    confirmNoButtonLabel: string;
    hideConfirmYesButton?: boolean;
    hideConfirmNoButton?: boolean;
    confirmableYesButtonClassName?: string;
    confirmableNoButtonClassName?: string;
    isDisabledYesButton?: boolean;
    onClick: () => void;
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
    onClick,
    ...restProps
}: ConfirmableButtonProps) {
    const [isModalOpened, showModal, hideModal] = useModalControl();

    return (
        <>
            <Button
                {...restProps}
                onClick={showModal}
            />
            <Modal
                isOpen={isModalOpened}
                size='lg'
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
                                            onClick={hideModal}
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
                                            onClick={onClick}
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
