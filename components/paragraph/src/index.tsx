interface ParagraphProps {
  className?: string;
  bold?: boolean;
  indent?: boolean;
  fontSize?: number;
  textAlign?: "left" | "right" | "unset";
  children?: string | JSX.Element | JSX.Element[];
}
export default function Paragraph({
  className,
  bold = false,
  indent = false,
  fontSize = 16,
  textAlign = "unset",
  children,
}: ParagraphProps) {
  return (
    <p
      className={className}
      style={{
        fontWeight: bold ? "bold" : "unset",
        textIndent: indent ? `${fontSize}px` : "unset",
        fontSize: `${fontSize}px`,
        wordBreak: `keep-all`,
        textAlign,
      }}
    >
      {children}
    </p>
  );
}
