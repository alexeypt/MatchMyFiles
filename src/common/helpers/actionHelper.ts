import { toast } from "react-toastify";


interface NotificationOptions {
    successText?: string;
    errorText?: string;
}

export async function action<T>(actionCallback: () => Promise<T>, options: NotificationOptions): Promise<[boolean, T | null]> {
    try {
        const result = await actionCallback();

        if (options.successText) {
            toast.success(options.successText);
        }

        return [true, result];
    } catch (error: any) {
        if (options.errorText) {
            toast.error(options.errorText);
        }

        return [false, null];
    }
}
