import { PAGE_CONTAINER_ID } from "@/layout/constants/layoutSelectors";


export default function SkipToMainContentButton() {
    return (
        <a
            href={`#${PAGE_CONTAINER_ID}`}
            className="absolute flex place-items-center left-0 top-[-4rem] h-16 bg-blue-600 text-white p-2 transition duration-300 focus:top-0 z-50"
        >
            Skip to main content
        </a>
    );
}
