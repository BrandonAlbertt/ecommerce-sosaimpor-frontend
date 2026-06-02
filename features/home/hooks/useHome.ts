"use client";

import { useEffect, useState } from "react";

import { storeLocation } from "@/features/store/storeLocation";

import { getHomeConfig } from "../api/homeApi";
import type { HomeConfigApiItem, HomeContentModel, HomeState } from "../types/home.types";

const initialState: HomeState = {
  config: null,
  error: null,
  homeContent: null,
  isLoading: true,
};

function adaptHomeConfigToContent(config: HomeConfigApiItem): HomeContentModel {
  return {
    banner: {
      imageLabel: "IMAGEN MOTOR",
      primaryMessage: config.banner_primary_message,
      secondaryMessage: config.banner_secondary_message,
      tertiaryMessage: config.banner_tertiary_message,
      subtitle: config.banner_subtitle,
      title: config.banner_title,
    },
    header: {
      helpLabel: config.header_help_label,
      locationLabel: config.header_location_label,
      locationSubLabel: config.header_location_sub_label,
      phoneLabel: config.header_phone_label,
      primaryMessage: config.header_primary_message,
      scheduleFriday: config.header_schedule_friday,
      scheduleSaturday: config.header_schedule_saturday,
      shippingBadge: config.header_shipping_badge,
      secondaryMessage: config.header_secondary_message,
      whatsappLabel: config.header_whatsapp_label,
      whatsappSubLabel: config.header_whatsapp_sub_label,
      whatsappUrl: config.header_whatsapp_url,
    },
    location: {
      displayAddress: config.location_display_address,
      displayDistrict: config.location_display_district,
      modal: storeLocation,
    },
    sellerWhatsappUrl: config.seller_whatsapp_url,
  };
}

export function useHome() {
  const [state, setState] = useState<HomeState>(initialState);

  useEffect(() => {
    const controller = new AbortController();

    getHomeConfig(controller.signal)
      .then((response) => {
        const homeContent = response.data.is_active
          ? adaptHomeConfigToContent(response.data)
          : null;

        setState({
          config: response.data,
          error: null,
          homeContent,
          isLoading: false,
        });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }

        setState({
          config: null,
          error: error instanceof Error ? error.message : "No se pudo cargar la informacion del home.",
          homeContent: null,
          isLoading: false,
        });
      });

    return () => controller.abort();
  }, []);

  return state;
}
