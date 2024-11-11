import { Fragment, ReactNode } from 'react';


interface KeyValueListProps {
    items: Map<string, ReactNode> | null;
    skipNullableValues?: boolean;
}

export default function KeyValueList({ items, skipNullableValues = false }: KeyValueListProps) {
    if (!items) {
        return null;
    }

    return (
        <dl className="grid grid-cols-1 gap-x-20 w-full font-serif md:grid-cols-[max-content_1fr] md:gap-y-6 md:items-center">
            {
                Array.from(items.entries()).filter(([, value]) => skipNullableValues ? !!value : true).map(([key, value]) => (
                    <Fragment key={key}>
                        <dt className="text-2xl text-blue-950">
                            {key}
                        </dt>
                        <dd className="text-green-950 text-xl font-semibold mt-3 mb-6 md:m-0 wrap-anywhere">
                            {value}
                        </dd>
                    </Fragment>
                ))
            }
        </dl >
    );
}
