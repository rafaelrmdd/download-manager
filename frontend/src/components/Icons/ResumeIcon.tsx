import type { IconProps } from "./types";

export function ResumeIcon({
    color,
}: IconProps) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 -960 960 960"
            className={`w-5 h-5 ${color}`}
        >
            <path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z"/>
        </svg>
    )
}