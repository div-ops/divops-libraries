import Link from "next/link";
import { useRouter } from "next/router";
import { useCallback } from "react";

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

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      if (router == null) {
        console.log("useRouter", useRouter);
        console.log("router", router);
      }

      if (router.isReady) {
        router.push(href);
      } else {
        alert("잠시 후 재시도해주세요 🙏");
      }
    },
    [router]
  );

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
