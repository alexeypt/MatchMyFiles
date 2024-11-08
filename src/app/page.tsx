import { Button, Link } from "@nextui-org/react";

import { ROOT_FOLDER_ROUTE } from "@/common/constants/routes";


export default async function Home() {
    return (
        <div className="-mx-4 md:-mx-5 2xl:-mx-0 -mt-8 2xl:-mt-10">
            <section className="bg-primary text-white py-20">
                <div className="flex flex-col items-center gap-6 px-6 text-center">
                    <h1 className="text-4xl font-bold font-serif">Simplify Duplicate File Detection and Management with Match My Files</h1>
                    <p className="text-lg">Match My Files helps you quickly identify duplicate files across multiple folders. Using advanced file hashing and size matching, it ensures that no duplicate goes undetected, allowing you to keep your storage tidy and optimized.</p>
                    <Button
                        as={Link}
                        variant="flat"
                        radius="full"
                        size="lg"
                        href={ROOT_FOLDER_ROUTE}
                        className="bg-white text-primary font-bold w-fit my-3"
                    >
                        Go To Root Folders
                    </Button>
                </div>
            </section>
            <section className="py-20">
                <div className="px-6 text-center">
                    <h2 className="text-4xl font-bold font-serif mb-12">How Can Match My Files Help You?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Save Time and Effort</h3>
                            <p>Instantly locate duplicates within large folders and across directories without manual searching.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Free Up Storage</h3>
                            <p>By identifying duplicate files, you can delete unnecessary copies, creating more storage space on your device.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Organize Your Files</h3>
                            <p>Keep your folders tidy by eliminating redundant files, making it easier to find what you need when you need it.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Accurate Comparison</h3>
                            <p>Advanced matching techniques, including file hashing and size comparison, ensure reliable results every time.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-20 bg-orange-50">
                <div className="px-6 text-center">
                    <h2 className="text-4xl font-bold font-serif mb-12">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Root Folder Processing</h3>
                            <p>Select any folder, and Match My Files will analyze all files within it, saving details for quick identification.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Advanced Comparison</h3>
                            <p>Compare files between a primary folder and secondary folders to find duplicates efficiently.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">Accurate Matching</h3>
                            <p>Identifies duplicates using file hashes for small files and size matching for larger files.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-2">User-Friendly Interface</h3>
                            <p>Simple, intuitive interface for streamlined duplicate detection and management.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
