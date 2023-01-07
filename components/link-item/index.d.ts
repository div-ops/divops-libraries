/// <reference types="react" />
export default function LinkItem({ className, href, target, children, as, }: {
    className?: string;
    href: string;
    target?: "_self" | "_parent" | "_top" | "_blank";
    children: JSX.Element;
    as: (...args: any) => React.ReactElement;
}): import("@emotion/react/jsx-runtime").JSX.Element;
