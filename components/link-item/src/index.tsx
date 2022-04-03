import Link from "next/link";
import { useRouter } from "next/router";

export default function LinkItem({
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
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <li className={className}>
      <Link href={href} passHref>
        <a href={href} target={target} onClick={(e) => handleClick(e)}>
          {children}
        </a>
      </Link>
    </li>
  );
}
