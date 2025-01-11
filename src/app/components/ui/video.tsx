import { cn } from "./utils";

interface VideoProps {
  className?: string;
}

export function Video({ className }: VideoProps) {
  return (
    <video
      className={cn("", className)}
      src="/video/smoke-background-optimized.mp4"
      autoPlay
      loop
      muted
    ></video>
  );
}
