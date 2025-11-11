import type { IconProps } from "./types";

export function CheckedIcon({
    color,
}: IconProps) {
    return (

        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 -960 960 960"
            className={`w-5 h-5 ${color}`}
        >
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
        </svg>
    )
}