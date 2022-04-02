import React from "react";

export default function Title({
  padding,
  className = "",
  underline = false,
  children,
}: {
  padding?: string;
  className?: string;
  underline?: boolean;
  children: string | string[] | JSX.Element | JSX.Element[] | undefined;
}) {
  return (
    <h1
      className={className}
      style={{
        ...(padding ? { padding } : {}),
        ...(underline ? { textDecoration: `underline` } : {}),
      }}
    >
      {children}
    </h1>
  );
}
