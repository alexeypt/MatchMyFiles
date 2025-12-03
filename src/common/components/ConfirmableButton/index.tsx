import { ReactNode, useCallback } from 'react';
import { Button, ButtonProps } from '@heroui/button';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/modal';
import classNames from 'classnames';

import Heading from '@/common/components/Heading';
import useModalControl from '@/common/hooks/useModalControl';


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

    const mergedConfirmableNoButtonClassName = classNames(
        'w-full sm:w-fit',
        confirmableNoButtonClassName
    );

    const mergedConfirmableYesButtonClassName = classNames(
        'w-full sm:w-fit',
        confirmableYesButtonClassName
    );

    return (
        <>
            <Button
                {...restProps}
                onPress={showModal}
            />
            <Modal
                isOpen={isModalOpened}
                size="lg"
                scrollBehavior="inside"
                onClose={hideModal}
            >
                <ModalContent>
                    {
                        () => (
                            <>
                                <ModalHeader>
                                    <Heading level={2}>
                                        {confirmTitle}
                                    </Heading>
                                </ModalHeader>
                                <ModalBody>
                                    {confirmDescription}
                                </ModalBody>
                                <ModalFooter className="flex-col-reverse sm:flex-row sm:justify-between gap-5">
                                    {
                                        !hideConfirmNoButton && (
                                            <Button
                                                color="danger"
                                                variant="bordered"
                                                className={mergedConfirmableNoButtonClassName}
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
                                                className={mergedConfirmableYesButtonClassName}
                                                isDisabled={isDisabledYesButton}
                                                onPress={onYesButtonClicked}
                                            >
                                                {confirmYesButtonLabel}
                                            </Button>
                                        )
                                    }
                                </ModalFooter>
                            </>
                        )
                    }
                </ModalContent>
            </Modal>
        </>
    );
}
