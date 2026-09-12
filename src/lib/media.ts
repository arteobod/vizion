/**
 * Card-sized variants of case images.
 *
 * The case screenshots are stored at full size because the case page shows one
 * of them 1136px wide. The cards that link to those pages show the same file at
 * 281–361px — so every visitor to the home page was decoding a 1920x1080 image,
 * 2 megapixels of it, to fill a box a seventh of that width, three times over.
 * Downscaling that much is not free: the decode is on the main thread and the
 * full-size texture then has to be resampled by the GPU on every composited
 * frame, which is exactly the sort of cost that shows up as stutter on
 * integrated graphics and not at all on a desktop card.
 *
 * `-card` variants are generated at 1000px wide, which still covers the largest
 * card (361px) on a 3x display. `cardImage` maps a stored path to its variant;
 * `CaseCard` falls back to the original if the variant is missing, so an image
 * uploaded through the admin panel — which produces no variant — still shows.
 */

/** `/media/vimba.jpg` → `/media/vimba-card.jpg`. Anything else is left alone. */
export function cardImage(src: string): string {
  if (!src) return src
  // Only rewrite local media we generate variants for. Remote URLs and
  // admin-uploaded paths served from /api/images are returned untouched.
  if (!src.startsWith('/media/')) return src
  const dot = src.lastIndexOf('.')
  if (dot <= src.lastIndexOf('/')) return src
  return `${src.slice(0, dot)}-card.jpg`
}
