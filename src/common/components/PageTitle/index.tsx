import { ReactNode } from 'react';

import Heading from '@/common/components/Heading';


interface PageTitleProps {
    title: string;
    subtitle?: string | null;
    subtitleNode?: ReactNode;
    rightSideContent?: ReactNode;
}

export default function PageTitle({
    title,
    subtitle,
    subtitleNode,
    rightSideContent
}: PageTitleProps) {
    return (
        <div className="flex flex-col gap-7 mb-10">
            <div className="flex flex-col md:flex-row gap-4">
                <Heading
                    level={1}
                    className="grow text-5xl font-serif text-green-900"
                >
                    {title}
                </Heading>
                <div>
                    {rightSideContent}
                </div>
            </div>
            {subtitle && <p className="text-lg">{subtitle}</p>}
            {subtitleNode}
        </div>
    );
}
