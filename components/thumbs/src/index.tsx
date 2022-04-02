export default function Thumbs({
  className,
  text,
}: {
  className?: string;
  text: string;
}) {
  const regex = /[^ ㄱ-ㅎ가-힣a-zA-Z0-9_\-."!@#$%^&*()_=+]+/g;
  text = text?.replace(regex, "").trim();

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={className} alt={text} src={`/api/thumbs?text=${text}`} />
  );
}
