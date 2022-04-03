export interface HeaderProps {
  title?: string;
  description?: string;
  icon?: string;
  as?: ({ children }: { children: React.ReactNode }) => JSX.Element;
}

export default function Header({
  title = "creco.me",
  description = "creco.me에 오신걸 환영합니다.",
  icon = "/favicon.ico",
  as,
}: HeaderProps) {
  const Component = as;

  if (Component == null) {
    return null;
  }

  return (
    <Component>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <link rel="icon" href={icon} />
    </Component>
  );
}
