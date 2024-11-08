import { ReactNode } from "react";

import Heading from '@/common/components/Heading';


interface PageSectionProps {
    title: string;
    children: ReactNode;
    headingLevel: number;
    rightSideContent?: ReactNode;
}

export default function PageSection({
    title,
    headingLevel,
    rightSideContent,
    children }: PageSectionProps) {
    return (
        <section className="flex flex-col gap-8 mb-14 pt-4 border-t-1 border-gray-600">
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <Heading
                    level={headingLevel}
                    className="text-[2.5rem] grow text-green-900 font-serif"
                >
                    {title}
                </Heading>
                <div>
                    {rightSideContent}
                </div>
            </div>
            <div>
                {children}
            </div>
        </section>
    );
}
