export default function LinkItem({
  className,
  href,
  target = "_self",
  children,
  as,
}: {
  className?: string;
  href: string;
  target?: "_self" | "_parent" | "_top" | "_blank";
  children: JSX.Element;
  as: React.FC<{ href?: string; passHref?: boolean }>;
}) {
  const Link = as;

  return (
    <li className={className}>
      <Link href={href} passHref>
        <a href={href} target={target}>
          {children}
        </a>
      </Link>
    </li>
  );
}
