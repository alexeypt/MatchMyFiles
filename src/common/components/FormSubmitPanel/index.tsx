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
        <div className="flex justify-between my-4">
            <div className="flex gap-4 items-center">
                <Button
                    type="submit"
                    isDisabled={isSubmitting || !dirty}
                    isLoading={isSubmitting}
                    color={isValid ? 'primary' : 'warning'}
                    size="lg"
                    className={isDisabled ? 'opacity-60' : ''}
                >
                    {buttonLabel}
                </Button>
            </div>
            <div>
                {
                    onClose && (
                        <Button
                            type="button"
                            color="danger"
                            onPress={onClose}
                            size="lg"
                        >
                            Cancel
                        </Button>
                    )
                }
            </div>
            {customNode}
        </div>
    );
}
