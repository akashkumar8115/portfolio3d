import { getProjectMediaSource } from "@/lib/projectMedia";

type ProjectMediaProps = {
  src: string;
  title: string;
  isVideo: boolean;
  className?: string;
  imageClassName?: string;
};

export default function ProjectMedia({
  src,
  title,
  isVideo,
  className,
  imageClassName,
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
      />
    );
  }

  if (media.type === "video") {
    return <video src={media.src} controls playsInline className={className} />;
  }

  return <img src={media.src} alt={title} className={imageClassName ?? className} />;
}
