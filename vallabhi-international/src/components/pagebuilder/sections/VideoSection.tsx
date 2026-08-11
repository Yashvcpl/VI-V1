interface VideoData {
  heading?: string;
  videoEmbedUrl: string;
  caption?: string;
}

export function VideoSection({ data, isFirstOnPage }: { data: VideoData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";
  return (
    <section className="py-16">
      <div className="container-content max-w-3xl">
        {data.heading && <Heading className="mb-6 text-3xl">{data.heading}</Heading>}
        <div className="aspect-video overflow-hidden rounded-card">
          <iframe
            src={data.videoEmbedUrl}
            title={data.heading ?? "Video"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        </div>
        {data.caption && <p className="mt-3 font-body text-sm text-ledger/60">{data.caption}</p>}
      </div>
    </section>
  );
}
