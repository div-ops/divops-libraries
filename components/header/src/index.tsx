import Head from "next/head";

export interface HeaderProps {
  title?: string;
  description?: string;
  icon?: string;
}

export default function Header({
  title = "creco.me",
  description = "creco.me에 오신걸 환영합니다.",
  icon = "/favicon.ico",
}: HeaderProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={description} />
      <link rel="icon" href={icon} />
    </Head>
  );
}
