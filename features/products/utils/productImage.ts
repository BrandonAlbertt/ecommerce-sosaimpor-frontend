type ImageOptimizationOptions = {
  width: number;
  height: number;
  quality: number;
};

function isCloudinaryImage(url: URL) {
  return url.hostname.endsWith("cloudinary.com") && url.pathname.includes("/image/upload/");
}

function optimizeCloudinaryImage(url: URL, options: ImageOptimizationOptions) {
  const transformation = [
    "f_auto",
    `q_${options.quality}`,
    "c_fill",
    `w_${options.width}`,
    `h_${options.height}`,
  ].join(",");

  const [prefix, suffix] = url.pathname.split("/image/upload/");

  if (!suffix) {
    return url.toString();
  }

  url.pathname = `${prefix}/image/upload/${transformation}/${suffix}`;
  return url.toString();
}

function optimizeGenericImage(source: string, options: ImageOptimizationOptions) {
  try {
    const imageUrl = new URL(source);

    if (isCloudinaryImage(imageUrl)) {
      return optimizeCloudinaryImage(imageUrl, options);
    }

    imageUrl.searchParams.set("w", String(options.width));
    imageUrl.searchParams.set("h", String(options.height));
    imageUrl.searchParams.set("width", String(options.width));
    imageUrl.searchParams.set("height", String(options.height));
    imageUrl.searchParams.set("fit", "crop");
    imageUrl.searchParams.set("auto", "format");
    imageUrl.searchParams.set("q", String(options.quality));
    imageUrl.searchParams.set("quality", String(options.quality));

    return imageUrl.toString();
  } catch {
    return source;
  }
}

export function getSmallProductImage(source: string) {
  return optimizeGenericImage(source, {
    width: 96,
    height: 96,
    quality: 45,
  });
}

export function getCatalogProductImage(source: string) {
  return optimizeGenericImage(source, {
    width: 420,
    height: 315,
    quality: 45,
  });
}

export function getProductDetailImage(source: string) {
  return optimizeGenericImage(source, {
    width: 640,
    height: 640,
    quality: 42,
  });
}

export function getMobileProductDetailImage(source: string) {
  return optimizeGenericImage(source, {
    width: 640,
    height: 640,
    quality: 45,
  });
}

export function getProductThumbnailImage(source: string) {
  return optimizeGenericImage(source, {
    width: 112,
    height: 112,
    quality: 30,
  });
}

export function getSmallCategoryImage(source: string) {
  return optimizeGenericImage(source, {
    width: 160,
    height: 96,
    quality: 35,
  });
}
