import { Button } from "@nextui-org/react";
import { useFormikContext } from "formik";

interface FormSubmitPanelProps {
    isEditMode: boolean;
    onClose?: () => void;
}

export default function FormSubmitPanel({ isEditMode, onClose }: FormSubmitPanelProps) {
    const { isSubmitting, isValid, dirty } = useFormikContext();

    const isDisabled = isSubmitting || !dirty;

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
                    {isEditMode ? 'Update' : 'Create'}
                </Button>
            </div>
            <div>
                {
                    onClose && (
                        <Button
                            type="button"
                            color="danger"
                            onClick={onClose}
                            size="lg"
                        >
                            Cancel
                        </Button>
                    )
                }
            </div>
        </div>
    );
}
