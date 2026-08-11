import Link from "next/link";

interface HeroData {
  eyebrow?: string;
  heading: string;
  /** Optional second headline line, e.g. "Creating Opportunities" under "Building Connections". */
  headingAccent?: string;
  subheading: string;
  bannerImageUrl?: string;
  bannerImageAlt?: string;
  bannerOverlayColor?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
}

// Faint decorative world-map dot grid, used as a watermark behind the hero -
// evokes "global partner" without needing a licensed map asset.
function WorldMapWatermark() {
  const dots: [number, number][] = [];
  for (let row = 0; row < 14; row++) {
    for (let col = 0; col < 26; col++) {
      // Skip a pseudo-random subset so it reads as a loose map/network, not a grid.
      if ((row * 7 + col * 3) % 5 === 0) continue;
      dots.push([col * 24 + (row % 2) * 12, row * 24]);
    }
  }
  return (
    <svg viewBox="0 0 640 340" className="h-full w-full" aria-hidden="true">
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={2} fill="currentColor" />
      ))}
    </svg>
  );
}

// isFirstOnPage controls whether this renders the page's <h1> (only the first
// section on a page should - PageRenderer passes this down).
export function HeroSection({ data, isFirstOnPage }: { data: HeroData; isFirstOnPage: boolean }) {
  const Heading = isFirstOnPage ? "h1" : "h2";

  const overlayStyle = data.bannerOverlayColor
    ? { backgroundColor: data.bannerOverlayColor }
    : { backgroundImage: "linear-gradient(90deg,rgba(3,29,23,0.70)_0%,rgba(3,29,23,0.55)_45%,rgba(3,29,23,0.40)_100%)" };

  return (
    <section className="relative overflow-hidden bg-[#07253C]" aria-label="Introduction">
      <div
        className="hero-banner relative flex items-end overflow-hidden"
        style={data.bannerImageUrl ? { backgroundImage: `url(${data.bannerImageUrl})` } : undefined}
      >
        <div className="absolute inset-0" style={overlayStyle} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.10),transparent_40%)]" />

        <div className="container-content relative z-10 py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl text-white text-left">
            {data.eyebrow ? (
              <p className="mb-4 text-sm uppercase tracking-[0.28em] text-white/60 sm:text-base">{data.eyebrow}</p>
            ) : null}
            {data.heading ? (
              <Heading className="font-display text-4xl font-extrabold uppercase leading-[1.05] text-growth-100 sm:text-5xl lg:text-6xl">
                {data.heading}
              </Heading>
            ) : null}
            {data.headingAccent ? (
              <p className="mt-4 text-base font-semibold uppercase tracking-[0.18em] text-white/80 sm:text-lg">
                {data.headingAccent}
              </p>
            ) : null}
            {data.subheading ? (
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg sm:leading-8">
                {data.subheading}
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-4">
              {data.primaryCtaLabel && data.primaryCtaHref && (
                <Link href={data.primaryCtaHref} className="btn-primary bg-growth-700 hover:bg-growth-600">
                  {data.primaryCtaLabel}
                </Link>
              )}
              {data.secondaryCtaLabel && data.secondaryCtaHref && (
                <Link href={data.secondaryCtaHref} className="btn-secondary border-white/40 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                  {data.secondaryCtaLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
