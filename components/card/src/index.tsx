// import React from "react";

// export default function Card({
//   className,
//   children,
// }: {
//   className?: string;
//   children: string | JSX.Element | JSX.Element[];
// }) {
//   return (
//     <div
//       className={className}
//       style={{
//         padding: "1em",
//         borderRadius: "10px",
//         cursor: "pointer",
//         boxShadow:
//           "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
//       }}
//     >
//       {children}
//     </div>
//   );
// }
import { css } from "@emotion/react";

export default function Card({
  className,
  children,
}: {
  className?: string;
  children: string | JSX.Element | JSX.Element[];
}) {
  return (
    <div
      className={className}
      css={css`
        padding: 1em;
        border-radius: 10px;
        cursor: pointer;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
          0 6px 20px 0 rgba(0, 0, 0, 0.19);
      `}
    >
      {children}
    </div>
  );
}
