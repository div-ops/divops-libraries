export default function List({
  className,
  children,
}: {
  className?: string;
  children: JSX.Element[] | JSX.Element;
}) {
  return <ul className={className}>{children}</ul>;
}
