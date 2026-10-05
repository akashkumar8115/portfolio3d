function getGoogleDriveFileId(source: string) {
  try {
    const url = new URL(source);
    if (url.hostname !== "drive.google.com" && url.hostname !== "www.drive.google.com") {
      return null;
    }

    const pathMatch = url.pathname.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const id = pathMatch?.[1] ?? url.searchParams.get("id");
    return id && /^[a-zA-Z0-9_-]+$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export function getGoogleDriveImageSource(source: string) {
  const driveFileId = getGoogleDriveFileId(source);
  return driveFileId ? `https://drive.google.com/thumbnail?id=${driveFileId}&sz=w1600` : source;
}

export function getProjectMediaSource(source: string, isVideo: boolean) {
  const driveFileId = getGoogleDriveFileId(source);

  if (driveFileId) {
    return isVideo
      ? { type: "drive-video" as const, src: `https://drive.google.com/file/d/${driveFileId}/preview` }
      : { type: "image" as const, src: getGoogleDriveImageSource(source) };
  }

  return isVideo
    ? { type: "video" as const, src: source }
    : { type: "image" as const, src: source };
}
