interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  mobileWidth?: number;
  desktopWidth?: number;
  quality?: number;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
}

function buildOptimizedUrl(src: string, width: number, format: "webp" | "avif", quality: number): string {
  return `/api/img?url=${encodeURIComponent(src)}&w=${width}&f=${format}&q=${quality}`;
}

function isObjectStorageUrl(src: string): boolean {
  return src.startsWith("/objects/") || src.startsWith("/api/objects/");
}

export function ResponsiveImage({
  src,
  alt,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  mobileWidth = 800,
  desktopWidth = 1600,
  quality = 85,
  loading = "lazy",
  fetchPriority = "auto"
}: ResponsiveImageProps) {
  if (!isObjectStorageUrl(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    );
  }

  const mobileWebp = buildOptimizedUrl(src, mobileWidth, "webp", quality);
  const desktopWebp = buildOptimizedUrl(src, desktopWidth, "webp", quality);
  const mobileAvif = buildOptimizedUrl(src, mobileWidth, "avif", quality);
  const desktopAvif = buildOptimizedUrl(src, desktopWidth, "avif", quality);

  return (
    <picture>
      <source
        type="image/avif"
        srcSet={`${mobileAvif} ${mobileWidth}w, ${desktopAvif} ${desktopWidth}w`}
        sizes={sizes}
      />
      <source
        type="image/webp"
        srcSet={`${mobileWebp} ${mobileWidth}w, ${desktopWebp} ${desktopWidth}w`}
        sizes={sizes}
      />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
      />
    </picture>
  );
}
