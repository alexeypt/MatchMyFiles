import { ReactNode } from "react";
import { Button } from "@nextui-org/react";
import { useFormikContext } from "formik";


interface FormSubmitPanelProps {
    isEditMode: boolean;
    onClose?: () => void;
    customNode?: ReactNode;
    submitButtonLabel?: string;
}

export default function FormSubmitPanel({
    isEditMode,
    onClose,
    customNode,
    submitButtonLabel
}: FormSubmitPanelProps) {
    const { isSubmitting, isValid, dirty } = useFormikContext();

    const isDisabled = isSubmitting || !dirty;

    const buttonLabel = submitButtonLabel ?? (isEditMode ? 'Update' : 'Create');

    return (
        <div className="flex flex-col my-4 sm:flex-row sm:justify-between gap-4">
            <div className="flex items-center">
                <Button
                    type="submit"
                    isDisabled={isSubmitting || !dirty}
                    isLoading={isSubmitting}
                    color={isValid ? 'primary' : 'warning'}
                    size="lg"
                    className={isDisabled ? 'opacity-60 w-full sm:w-fit' : 'w-full sm:w-fit'}
                >
                    {buttonLabel}
                </Button>
            </div>
            {
                onClose && (
                    <div>
                        <Button
                            type="button"
                            color="danger"
                            size="lg"
                            className="w-full sm:w-fit"
                            onPress={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                )
            }
            {customNode}
        </div>
    );
}
