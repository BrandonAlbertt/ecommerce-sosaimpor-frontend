export function getSmallProductImage(source: string) {
  try {
    const imageUrl = new URL(source);

    if (imageUrl.hostname.endsWith("unsplash.com")) {
      imageUrl.searchParams.set("w", "96");
      imageUrl.searchParams.set("h", "96");
      imageUrl.searchParams.set("fit", "crop");
      imageUrl.searchParams.set("auto", "format");
      imageUrl.searchParams.set("q", "60");
      return imageUrl.toString();
    }
  } catch {
    return source;
  }

  return source;
}

export function getCatalogProductImage(source: string) {
  try {
    const imageUrl = new URL(source);

    if (imageUrl.hostname.endsWith("unsplash.com")) {
      imageUrl.searchParams.set("w", "420");
      imageUrl.searchParams.set("h", "315");
      imageUrl.searchParams.set("fit", "crop");
      imageUrl.searchParams.set("auto", "format");
      imageUrl.searchParams.set("q", "45");
      return imageUrl.toString();
    }
  } catch {
    return source;
  }

  return source;
}
