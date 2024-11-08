import { Checkbox, CheckboxProps, Input, InputProps } from "@nextui-org/react";
import { useField } from "formik";


interface CheckboxFieldProps extends CheckboxProps {
    name: string;
}

export default function CheckboxField({ name, ...restProps }: CheckboxFieldProps) {
    const [fieldProps, meta] = useField(name);

    return (
        <Checkbox
            {...restProps}
            {...fieldProps}
            isSelected={fieldProps.value}
            isInvalid={!!meta.error && meta.touched}
        />
    );
}
