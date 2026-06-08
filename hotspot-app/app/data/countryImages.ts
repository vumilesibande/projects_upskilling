const LOCAL_IMAGE_BY_ID: Record<number, string> = {
  2: "/angola-falls.jpg",
  4: "/botswana-chobe-elephant.jpg",
  37: "/namibia-desert-ocean.jpg",
  46: "/table-mtn.jpg",
  53: "/vic-falls.jpg",
};

function scenicStockUrl(countryId: number, countryTitle: string): string {
  const slug = countryTitle
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/['’]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  return `https://picsum.photos/seed/hotspot-${countryId}-${slug}/1200/800`;
}

export function getCountryImageUrl(countryId: number, countryTitle: string): string {
  return LOCAL_IMAGE_BY_ID[countryId] ?? scenicStockUrl(countryId, countryTitle);
}

export function isLocalCountryImage(countryId: number): boolean {
  return countryId in LOCAL_IMAGE_BY_ID;
}
