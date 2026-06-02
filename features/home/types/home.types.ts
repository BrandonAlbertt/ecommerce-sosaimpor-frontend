import type { StoreLocation } from "@/features/store/storeLocation";

export type HomeConfigApiItem = {
  id: number;
  banner_primary_message: string;
  banner_secondary_message: string;
  banner_tertiary_message: string;
  banner_subtitle: string;
  banner_title: string;
  header_help_label: string;
  header_location_label: string;
  header_location_sub_label: string;
  header_phone_label: string;
  header_primary_message: string;
  header_schedule_friday: string;
  header_schedule_saturday: string;
  header_shipping_badge: string;
  header_secondary_message: string;
  header_whatsapp_label: string;
  header_whatsapp_sub_label: string;
  header_whatsapp_url: string;
  is_active: boolean;
  location_display_address: string;
  location_display_district: string;
  seller_whatsapp_url: string;
};

export type HomeConfigResponse = {
  ok: true;
  data: HomeConfigApiItem;
  pagination: null;
};

export type HomeContentModel = {
  banner: {
    imageLabel: string;
    primaryMessage: string;
    secondaryMessage: string;
    tertiaryMessage: string;
    subtitle: string;
    title: string;
  };
  header: {
    helpLabel: string;
    locationLabel: string;
    locationSubLabel: string;
    phoneLabel: string;
    primaryMessage: string;
    scheduleFriday: string;
    scheduleSaturday: string;
    shippingBadge: string;
    secondaryMessage: string;
    whatsappLabel: string;
    whatsappSubLabel: string;
    whatsappUrl: string;
  };
  location: {
    displayAddress: string;
    displayDistrict: string;
    modal: StoreLocation;
  };
  sellerWhatsappUrl: string;
};

export type HomeState = {
  config: HomeConfigApiItem | null;
  error: string | null;
  homeContent: HomeContentModel | null;
  isLoading: boolean;
};
