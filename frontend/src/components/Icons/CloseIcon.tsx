import type { IconProps } from "./types";

export function CloseIcon({
    color,

}: IconProps) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 -960 960 960" 
            className={`w-5 h-5 ${color}`}
        >
            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
        </svg>
    )
}