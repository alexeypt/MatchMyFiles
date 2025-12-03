'use client';

import { Button } from '@heroui/button';
import Link from 'next/link';

import Heading from '@/common/components/Heading';
import { HOME_ROUTE } from '@/common/constants/routes';


export default function NotFound() {
    return (
        <div className="flex flex-col gap-10">
            <Heading
                level={1}
                className="text-5xl font-serif text-red-900"
            >
                404 - Not Found
            </Heading>
            <p className="text-3xl font-serif">
                The page or resource you are looking for could not be found.
            </p>
            <Button
                as={Link}
                href={HOME_ROUTE}
                size="lg"
                variant="solid"
                color="primary"
                className="w-full sm:w-max sm:min-w-48 text-xl"
            >
                Go to Home
            </Button>
        </div>
    );
}
