import { PauseIcon } from "./Icons/PauseIcon";
import { ResumeIcon } from "./Icons/ResumeIcon";
import { DownloadIcon } from "./Icons/DownloadIcon";
import { CloseIcon } from "./Icons/CloseIcon";
import { CheckedIcon } from "./Icons/CheckedIcon";
import { TrashIcon } from "./Icons/TrashIcon";

type Status = 'in_progress' | 'finished' | 'paused'

interface DownloadItemProps {
    status: Status;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    download: chrome.downloads.DownloadItem;
}

export function DownloadItem({
    status,
    download
} : DownloadItemProps) {

    const convertKbToMb = (kbyte: number) => {
        return kbyte / 1024
    }

    const convertKbToGb = (kbyte: number) => {
        return kbyte / (1024 * 1024);
    }

    const formatFileSizeFromKb = (kbyte: number) => {
        switch (true) {
            case kbyte >= 1024 * 1024:
                return `${(convertKbToGb(kbyte)).toFixed(2)} GB`
            case kbyte >= 1024:
                return `${(convertKbToMb(kbyte)).toFixed(2)} MB`
            default: 
                return `${kbyte.toFixed(2)} KB`
        }
    }

    const progressPercentage = ((download.bytesReceived / download.totalBytes) * 100).toFixed(2);

    return (
        <div className="border border-t-gray-700 border-b-gray-700 p-4">
            <div className="flex justify-between">
                <div className="flex gap-x-2 items-center">
                    {
                        status === "in_progress" ? 
                            <DownloadIcon color="fill-blue-400" /> :
                        status === "paused" ? 
                            <PauseIcon color="fill-green-400" /> :
                        status === "finished" ? 
                            <CheckedIcon color="fill-green-400" /> : null      
                    }

                    <div className="flex flex-col">
                        <h2 className="text-white font-semibold text-[0.9rem]">{download.filename}</h2>
                        <h2 
                            className="text-gray-400 text-[0.9rem]"
                        >
                            <span className="mr-2">{formatFileSizeFromKb(download.fileSize)}</span>* 
                            {
                                status === "finished" ? 
                                    <span className="text-green-400 text-[0.8rem] ml-2">Finished</span> :
                                status === "in_progress" ? 
                                    <span className="ml-2">2.38 MB/s</span> : null
                            }  
                        </h2>
                    </div>
                </div>

                <div className="flex gap-x-2">
                    {
                        status === "in_progress" ? 
                            <PauseIcon color="fill-yellow-400"/> : 
                        status === "paused" ? 
                            <ResumeIcon color="fill-green-400"/> : 
                        null
                    }

                    {
                        status === "finished" ? 
                            <TrashIcon color="fill-gray-400"/> : <CloseIcon color="fill-red-400"/>
                    }
                </div>
            </div>

            {/* Progress Bar */}
            <div 
                className={`mt-2 ${status === "finished" ? "hidden" : null}`}
            >
                <div className="rounded-lg w-full h-2 bg-gray-700 max-w-full">
                    <div className="bg-blue-500 w-1/2 h-full rounded-lg">

                    </div>
                </div>

                <div className="flex justify-between mt-1">
                    <span className="text-[0.9rem] text-gray-400">{progressPercentage}</span>
                    <h2 
                        className="text-[0.9rem] text-gray-400"
                    >
                        <span>{formatFileSizeFromKb(download.bytesReceived)}</span> de <span>{formatFileSizeFromKb(download.totalBytes)}</span>
                    </h2>
                </div>
            </div>
        </div>
    )
}