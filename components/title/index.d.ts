/// <reference types="react" />
export default function Title({ padding, className, underline, children, }: {
    padding?: string;
    className?: string;
    underline?: boolean;
    children: string | string[] | JSX.Element | JSX.Element[] | undefined;
}): import("@emotion/react/jsx-runtime").JSX.Element;
