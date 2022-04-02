import { css } from "@emotion/react";

const CreatiCoding = () => (
  <a href="https://github.com/creaticoding" target="_blank" rel="noreferrer">
    <span
      style={{
        color: "gray",
        height: "1em",
        marginLeft: "0.5rem",
        outline: "none",
      }}
    >
      {"@creaticoding. "}
    </span>
  </a>
);

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={className}
      css={css`
        padding: 2rem 0;
        text-align: center;
        margin: 0 auto;
      `}
    >
      <CreatiCoding />
      <span style={{ color: "#0000004f" }}>All rights reserved.</span>
    </footer>
  );
}
