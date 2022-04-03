import Link from "next/link";
import { NextRouter } from "next/router";

export default function LinkItem({
  className,
  href,
  target = "_self",
  children,
  router,
}: {
  className?: string;
  href: string;
  target?: "_self" | "_parent" | "_top" | "_blank";
  children: JSX.Element;
  router: NextRouter;
}) {
  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <li className={className}>
      <Link href={href} passHref>
        <a href={href} target={target} onClick={handleClick}>
          {children}
        </a>
      </Link>
    </li>
  );
}
