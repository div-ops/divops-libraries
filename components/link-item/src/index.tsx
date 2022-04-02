import Link from "next/link";

export function LinkItem({
  className,
  href,
  target = "_self",
  children,
}: {
  className?: string;
  href: string;
  target?: "_self" | "_parent" | "_top" | "_blank";
  children: JSX.Element;
}) {
  return (
    <li className={className}>
      <Link href={href} passHref>
        <a target={target}>{children}</a>
      </Link>
    </li>
  );
}
