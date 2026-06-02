import { axiosClient } from "@/lib/axiosClient";
import { getCachedRequest, productCacheTimes } from "@/features/products/cache/productRequestCache";

import type { HomeConfigResponse } from "../types/home.types";

const homeConfigPath = "/api/configuracion";

export function getHomeConfig(signal?: AbortSignal) {
  return getCachedRequest(
    "home:config",
    productCacheTimes.config,
    () => axiosClient.get<HomeConfigResponse>(homeConfigPath),
    signal,
  );
}
