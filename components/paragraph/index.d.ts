/// <reference types="react" />
interface ParagraphProps {
    className?: string;
    bold?: boolean;
    indent?: boolean;
    fontSize?: number;
    textAlign?: "left" | "right" | "unset";
    children?: string | JSX.Element | JSX.Element[];
}
export default function Paragraph({ className, bold, indent, fontSize, textAlign, children, }: ParagraphProps): import("@emotion/react/jsx-runtime").JSX.Element;
export {};
