export type StoreLocation = {
  address: string;
  mapEmbedUrl: string;
  mapUrl: string;
};

// Variables publicas opcionales para produccion:
// NEXT_PUBLIC_STORE_ADDRESS muestra la direccion.
// NEXT_PUBLIC_STORE_MAP_URL abre Google Maps en una pestaña nueva.
// NEXT_PUBLIC_STORE_MAP_EMBED_URL alimenta el iframe del modal.
// Si faltan, se usan valores de respaldo para no romper la UI.
const storeAddress = process.env.NEXT_PUBLIC_STORE_ADDRESS ?? "Av. Los Proceres 123, San Martin de Porres, Lima";
const storeMapUrl = process.env.NEXT_PUBLIC_STORE_MAP_URL
  ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(storeAddress)}`;
const storeMapEmbedUrl = process.env.NEXT_PUBLIC_STORE_MAP_EMBED_URL
  ?? `https://maps.google.com/maps?q=${encodeURIComponent(storeAddress)}&output=embed`;

export const storeLocation: StoreLocation = {
  address: storeAddress,
  mapEmbedUrl: storeMapEmbedUrl,
  mapUrl: storeMapUrl,
};
