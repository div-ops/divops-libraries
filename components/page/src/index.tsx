import { css } from "@emotion/react";
import Footer from "@divops/component-footer";
import Header, { HeaderProps } from "@divops/component-header";
import Title from "@divops/component-title";

interface PageProps extends HeaderProps {
  className?: string;
  children: JSX.Element[] | JSX.Element | boolean | undefined | null;
  header?: React.FC;
}

export default function Page({
  className,
  children,
  title,
  description,
  icon,
  header,
}: PageProps) {
  return (
    <div className={className}>
      <Header as={header} title={title} description={description} icon={icon} />
      <div
        css={css`
          margin: 0 auto;
          min-height: calc(100vh - 83px);
        `}
      >
        {title && <Title padding="2rem 0">{title}</Title>}
        {children ? children : null}
      </div>
      <Footer />
    </div>
  );
}
