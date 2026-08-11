import Link from "next/link";
import type { Service } from "@/lib/db/schema";
import { sanitizeHtml } from "@/lib/sanitizeHtml";
import { parseServiceContentBlocks } from "@/lib/service-content";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatServiceContentHtml(raw: string | null | undefined) {
  if (!raw || !raw.trim()) return "";
  const trimmed = raw.trim();
  const hasHtmlTags = /<\/?[a-z][\s\S]*>/i.test(trimmed);
  if (hasHtmlTags) {
    return sanitizeHtml(trimmed);
  }

  const lines = trimmed.split(/\r?\n/);
  const blocks: string[] = [];
  let activeListType: "ul" | "ol" | null = null;
  let activeListItems: string[] = [];
  let paragraphLines: string[] = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    const paragraphHtml = paragraphLines.map((line) => escapeHtml(line)).join("<br />");
    blocks.push(`<p>${paragraphHtml}</p>`);
    paragraphLines = [];
  };

  const flushList = () => {
    if (!activeListType || activeListItems.length === 0) return;
    const listHtml = activeListItems.map((item) => `<li>${item}</li>`).join("");
    blocks.push(`<${activeListType}>${listHtml}</${activeListType}>`);
    activeListType = null;
    activeListItems = [];
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine === "") {
      flushParagraph();
      flushList();
      continue;
    }

    const unorderedMatch = trimmedLine.match(/^[-*+]\s+(.*)$/);
    const orderedMatch = trimmedLine.match(/^(\d+)\.\s+(.*)$/);

    if (unorderedMatch) {
      flushParagraph();
      const text = escapeHtml(unorderedMatch[1]);
      if (activeListType !== "ul") {
        flushList();
        activeListType = "ul";
      }
      activeListItems.push(text);
      continue;
    }

    if (orderedMatch) {
      flushParagraph();
      const text = escapeHtml(orderedMatch[2]);
      if (activeListType !== "ol") {
        flushList();
        activeListType = "ol";
      }
      activeListItems.push(text);
      continue;
    }

    if (activeListType) {
      const continuation = escapeHtml(trimmedLine);
      activeListItems[activeListItems.length - 1] += `<br />${continuation}`;
      continue;
    }

    paragraphLines.push(trimmedLine);
  }

  flushParagraph();
  flushList();

  return sanitizeHtml(blocks.join(""));
}

function getBannerStyle(service: Service) {
  const opacity = Math.min(100, Math.max(0, Number(service.bannerOverlayOpacity ?? 55)));
  const overlay = `rgba(8, 39, 32, ${opacity / 100})`;
  const backgroundImage = service.bannerImageUrl
    ? `linear-gradient(${overlay}, ${overlay}), url(${service.bannerImageUrl})`
    : "linear-gradient(135deg, rgba(8,39,32,0.88), rgba(8,39,32,0.72))";

  return { backgroundImage } as const;
}

export function ServiceDetailPageContent({ service }: { service: Service }) {
  const blocks = parseServiceContentBlocks(service.serviceContentBlocks);
  const ctaHeading = service.ctaHeading?.trim();
  const ctaDescription = service.ctaDescription?.trim();
  const ctaButtonText = service.ctaButtonText?.trim();
  const showCta = Boolean(ctaHeading || ctaDescription || ctaButtonText);

  return (
    <article className="pb-20">
      <section className="relative isolate overflow-hidden">
        <div className="hero-banner flex items-center" style={getBannerStyle(service)}>
          <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl text-white">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {service.title || "Service"}
              </h1>
            </div>
          </div>
        </div>
      </section>

      {blocks.length > 0 ? (
        <section className="mt-12 px-4 sm:px-6 lg:px-8">
          <div className="rounded-[32px] border border-ledger/10 bg-paper px-5 py-8 shadow-[0_20px_80px_rgba(17,46,66,0.08)] sm:px-8 sm:py-10 lg:px-10">
            <div className="space-y-10">
              {blocks.map((block) => (
                <div key={block.id} className="space-y-4">
                  {block.heading ? <h2 className="text-3xl font-semibold text-ledger sm:text-4xl">{block.heading}</h2> : null}
                  {block.content ? (
                    <div
                      className="prose-ledger text-base leading-8 text-ledger/80"
                      dangerouslySetInnerHTML={{ __html: formatServiceContentHtml(block.content) }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {showCta ? (
        <section className="mt-12 px-4 sm:px-6 lg:px-8">
          <div className="rounded-[36px] border border-ledger/10 bg-paper px-6 py-8 shadow-[0_18px_70px_rgba(9,45,72,0.08)] sm:px-8 sm:py-10 lg:px-10 lg:py-12">
            <div className="max-w-3xl">
              {ctaHeading ? <h2 className="text-3xl sm:text-4xl">{ctaHeading}</h2> : null}
              {ctaDescription ? (
                <div className="prose-ledger mt-5 text-base leading-8 text-ledger/75">
                  <p>{ctaDescription}</p>
                </div>
              ) : null}
            </div>
            {ctaButtonText ? (
              <div className="mt-8">
                <Link href="/contact-us#contact-form-heading" className="btn-primary inline-flex">
                  {ctaButtonText}
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </article>
  );
}
