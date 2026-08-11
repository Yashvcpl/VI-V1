import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

/**
 * Renders admin-authored markdown (service/blog/news/job descriptions, company
 * overview) to sanitized HTML. Sanitizing matters here even though only admins
 * can write this content - it's defense in depth against a compromised admin
 * account or a copy-pasted snippet containing a stray <script>.
 */
export function renderMarkdown(source: string | null | undefined): string {
  if (!source) return "";
  const rawHtml = marked.parse(source, { async: false }) as string;
  return DOMPurify.sanitize(rawHtml);
}
