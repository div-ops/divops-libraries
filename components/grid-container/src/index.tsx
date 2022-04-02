import { css } from "@emotion/react";

interface Props {
  children?: React.ReactNode;
  className?: string;
}

export default function GridContainer({ className, children }: Props) {
  return (
    <div
      className={className}
      css={css`
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 2em;

        @media (max-width: 540px) {
          grid-template-columns: repeat(1, 1fr);
          gap: 2em;
        }
      `}
    >
      {children}
    </div>
  );
}
