import './index.css';


/*
    currently spinner is shown above empty page as there is no proper way to identify that navigation process has started
    https://github.com/vercel/next.js/discussions/41934#discussioncomment-8996669
*/
export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center h-full grow text-blue-400">
            <div className="lds-spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    );
}
