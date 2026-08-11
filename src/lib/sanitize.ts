import sanitizeHtmlLib from "sanitize-html";

/**
 * Sanitises admin-authored rich text before it is rendered with
 * dangerouslySetInnerHTML. Applied at render (not only at write) so that
 * anything already sitting in the database is cleaned too.
 *
 * Uses sanitize-html rather than isomorphic-dompurify on purpose: the latter
 * depends on jsdom, which pulled ~770 extra files into the serverless bundle
 * and failed at runtime on Vercel. sanitize-html is pure JS (htmlparser2).
 */
export function sanitizeHtml(html: string): string {
  return sanitizeHtmlLib(html, {
    allowedTags: [
      "p", "br", "strong", "em", "u", "s", "h1", "h2", "h3", "h4",
      "ul", "ol", "li", "blockquote", "hr", "a", "img", "code", "pre", "span",
    ],
    allowedAttributes: {
      "*": ["class", "style", "title"],
      a: ["href", "target", "rel"],
      img: ["src", "alt"],
    },
    // Relative URLs stay allowed; anything else must use a safe scheme.
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowProtocolRelative: false,
    // The editor only ever emits text-align, so don't let arbitrary CSS through.
    allowedStyles: {
      "*": { "text-align": [/^left$|^right$|^center$|^justify$/] },
    },
    transformTags: {
      a: sanitizeHtmlLib.simpleTransform("a", {
        rel: "noopener noreferrer nofollow",
        target: "_blank",
      }),
    },
  });
}
