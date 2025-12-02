import { SyntheticEvent, useCallback } from "react";
import { Input, InputProps } from "@heroui/input";
import { useField } from "formik";


interface InputFieldProps extends InputProps {
    name: string;
    startContentText?: string;
    isLargeText?: boolean;
}

export default function InputField({
    name,
    startContentText,
    isLargeText,
    ...restProps
}: InputFieldProps) {
    const [fieldProps, meta] = useField(name);

    const isInvalid = !!meta.error && meta.touched;

    const onNumberFieldWheel = useCallback((e: SyntheticEvent<HTMLInputElement>) => {
        // based on https://stackoverflow.com/a/69497807
        (e.target as HTMLInputElement).blur();
        e.stopPropagation();
        setTimeout(() => {
            (e.target as HTMLInputElement).focus();
        }, 0);
    }, []);


    return (
        <Input
            startContent={
                startContentText ? (
                    <div className="pointer-events-none flex items-center">
                        <span className="text-default-600 text-small">{startContentText}</span>
                    </div>
                ) : undefined
            }
            {...restProps}
            {...fieldProps}
            onWheel={restProps.type === 'number' ? onNumberFieldWheel : undefined}
            isInvalid={isInvalid}
            errorMessage={meta.error}
            classNames={{
                helperWrapper: !isInvalid ? 'p-0' : undefined,
                input: isLargeText ? 'font-bold text-xl leading-5' : undefined,
                label: 'text-nowrap',
                inputWrapper: restProps.isDisabled ? 'bg-gray-100' : undefined,
                description: 'font-bold text-sm mt-1 text-red-900'
            }}
        />
    );
}
