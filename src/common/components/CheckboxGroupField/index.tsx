import { Checkbox, CheckboxGroup, CheckboxGroupProps, Input, InputProps } from "@nextui-org/react";
import { useField } from "formik";


interface CheckboxGroupFieldProps extends CheckboxGroupProps {
    name: string;
    items: {
        value: string;
        label: string;
    }[];
}

export default function CheckboxGroupField({ name, items, ...restProps }: CheckboxGroupFieldProps) {
    const [fieldProps, meta] = useField(name);

    return (
        <CheckboxGroup
            {...restProps}
            value={fieldProps.value}
            isInvalid={!!meta.error && meta.touched}
        >
            {
                items.map(item => (
                    <Checkbox
                        key={item.value}
                        name={fieldProps.name}
                        onBlur={fieldProps.onBlur}
                        onChange={fieldProps.onChange}
                        value={item.value}
                    >
                        {item.label}
                    </Checkbox>
                ))
            }
        </CheckboxGroup>
    );
}
