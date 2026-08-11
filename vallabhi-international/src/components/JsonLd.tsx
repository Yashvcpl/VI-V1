/**
 * Renders a JSON-LD <script> tag. JSON.stringify output is safe here because it's
 * structured data we build ourselves from typed fields, not raw HTML - but we still
 * escape "<" to prevent any edge case where a CMS string value contains "</script>".
 */
export function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
