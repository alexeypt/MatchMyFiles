import { Textarea, TextAreaProps } from "@heroui/input";
import { useField } from "formik";


interface TextAreaFieldProps extends TextAreaProps {
    name: string;
}

export default function TextAreaField({ name, ...restProps }: TextAreaFieldProps) {
    const [fieldProps, meta] = useField(name);

    return (
        <Textarea
            {...restProps}
            {...fieldProps}
            isInvalid={!!meta.error && meta.touched}
            errorMessage={meta.error}
            classNames={{
                inputWrapper: restProps.isDisabled ? 'bg-gray-100' : undefined,
                label: 'text-foreground-600'
            }}
        />
    );
}
