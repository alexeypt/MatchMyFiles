'use client';

import { useCallback, useEffect } from 'react';
import { Button } from '@heroui/button';

import Heading from '@/common/components/Heading';


interface ErrorPageProps {
    error: Error & { digest?: string };
    reset?: () => void;
}

export default function ErrorPage({
    error,
    reset
}: ErrorPageProps) {
    const log = useCallback(async (error: Error & { digest?: string }) => {
        console.error(error.message);
    }, []);

    useEffect(() => {
        log(error);
    }, [error, log]);

    return (
        <div className="flex flex-col gap-10">
            <Heading
                level={1}
                className="text-5xl font-serif text-red-900"
            >
                Something went wrong!
            </Heading>
            {
                error.message && (
                    <p className="text-3xl font-serif">Error: {error.message}</p>
                )
            }
            {
                reset && (
                    <Button
                        size="lg"
                        variant="solid"
                        color="primary"
                        className="w-full sm:w-max sm:min-w-48 text-xl"
                        onPress={() => reset()}
                    >
                        Try again
                    </Button>
                )
            }
        </div>
    );
}
