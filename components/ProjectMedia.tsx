import Image from "next/image";
import { getProjectMediaSource } from "@/lib/projectMedia";

type ProjectMediaProps = {
  src: string;
  title: string;
  isVideo: boolean;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
};

export default function ProjectMedia({
  src,
  title,
  isVideo,
  className,
  imageClassName,
  sizes,
  priority = false,
}: ProjectMediaProps) {
  const media = getProjectMediaSource(src, isVideo);

  if (media.type === "drive-video") {
    return (
      <iframe
        src={media.src}
        title={`${title} video`}
        className={className}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        loading="lazy"
      />
    );
  }

  if (media.type === "video") {
    return <video src={media.src} controls playsInline preload="none" className={className} />;
  }

  return (
    <div className={`relative ${className ?? "aspect-video w-full"}`}>
      <Image
        src={media.src}
        alt={`${title} project preview`}
        fill
        sizes={sizes ?? "(max-width: 640px) 100vw, (max-width: 1200px) 90vw, 1200px"}
        priority={priority}
        unoptimized={media.src.startsWith("http")}
        className={imageClassName ?? "object-cover"}
      />
    </div>
  );
}
