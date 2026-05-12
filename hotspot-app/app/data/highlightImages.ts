/**
 * Curated Unsplash photos matched to each highlight theme.
 * See https://unsplash.com/license — free use; attribution to photographers is encouraged.
 */
const u = (photoPath: string) =>
  `https://images.unsplash.com/${photoPath}?auto=format&fit=crop&w=1200&q=80`;

export const HIGHLIGHT_IMAGE_URLS: Record<string, string> = {
  Wildlife: u("photo-1557050543-4d5ebe430c13"),
  Desert: u("photo-1509316785289-025f5cd846e9"),
  Waterfall: u("photo-1432405972618-c60b02209b82"),
  Mountain: u("photo-1464822759023-fed622ff2c3b"),
  Coast: u("photo-1507525428034-b723cf961d3e"),
  Culture: u("photo-1512813195380-6cf9bdb51b69"),
  Heritage: u("photo-1555993539-1732ca0255c2"),
  Islands: u("photo-1506905925346-21bda4d32df4"),
  Lakes: u("photo-1439066615861-d1af74d74000"),
  Rainforest: u("photo-1441974231531-c6227db76b6e"),
  Savannah: u("photo-1470240731273-78285a329b55"),
};

const FALLBACK = u("photo-1451187580459-43490279c0fa");

export function getHighlightImageUrl(highlight: string): string {
  return HIGHLIGHT_IMAGE_URLS[highlight] ?? FALLBACK;
}
