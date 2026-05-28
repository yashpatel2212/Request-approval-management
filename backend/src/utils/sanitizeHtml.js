import sanitizeHtmlLib from "sanitize-html";

export const sanitizeRichText = (html = "") =>
  sanitizeHtmlLib(html, {
    allowedTags: sanitizeHtmlLib.defaults.allowedTags.concat(["img", "h1", "h2"]),
    allowedAttributes: {
      ...sanitizeHtmlLib.defaults.allowedAttributes,
      img: ["src", "alt"]
    },
    allowedSchemes: ["http", "https", "data"]
  });
