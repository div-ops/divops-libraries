interface SpaceProps {
  width?: number;
  height?: number;
}
export default function Space({ width = 0, height = 0 }: SpaceProps) {
  return (
    <div
      style={{
        display: width === 0 ? "display" : "inline",
        width: width ? `${width}px` : "100%",
        height: height ? `${height}px` : "100%",
      }}
    ></div>
  );
}
