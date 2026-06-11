"use client";

// ============================================================
// HOOK PARA METRICAS DE PRODUCTO
// ============================================================
// Registra una vista real del detalle de producto.
// No usa context, providers ni estado global: solo productoId, useEffect y localStorage.
//
// Flujo:
// 1. El container de detalle recibe/carga el producto real.
// 2. Este hook revisa si ese producto ya registro vista recientemente.
// 3. Si pasaron 30 minutos, vuelve a enviar POST al backend.

import { useEffect, useRef } from "react";

import { axiosClient } from "@/lib/axiosClient";

type ProductViewRecord = {
  productoId: number;
  timestamp: number;
};

const productViewStoragePrefix = "sosaimpor:producto-vista";
const productViewIntervalMs = 30 * 60 * 1000;

function getProductViewStorageKey(productoId: number) {
  return `${productViewStoragePrefix}:${productoId}`;
}

function readProductViewRecord(productoId: number) {
  try {
    const savedValue = localStorage.getItem(getProductViewStorageKey(productoId));

    if (!savedValue) {
      return null;
    }

    const parsedValue = JSON.parse(savedValue) as Partial<ProductViewRecord>;

    if (parsedValue.productoId !== productoId || typeof parsedValue.timestamp !== "number") {
      return null;
    }

    return parsedValue as ProductViewRecord;
  } catch {
    return null;
  }
}

function saveProductViewRecord(productoId: number, timestamp: number) {
  try {
    const record: ProductViewRecord = {
      productoId,
      timestamp,
    };

    localStorage.setItem(getProductViewStorageKey(productoId), JSON.stringify(record));
  } catch {
    // Si el navegador bloquea localStorage, la tienda debe seguir funcionando.
  }
}

function shouldRegisterProductView(record: ProductViewRecord | null, currentTimestamp: number) {
  if (!record) {
    return true;
  }

  return currentTimestamp - record.timestamp >= productViewIntervalMs;
}

export function useProductMetrics(productoId: number | null | undefined) {
  const lastHandledProductIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!productoId) {
      return;
    }

    // Evita repetir el mismo POST por re-render dentro del mismo detalle.
    if (lastHandledProductIdRef.current === productoId) {
      return;
    }

    lastHandledProductIdRef.current = productoId;

    const currentTimestamp = Date.now();
    const savedRecord = readProductViewRecord(productoId);

    if (!shouldRegisterProductView(savedRecord, currentTimestamp)) {
      return;
    }

    // Guardamos antes del POST para evitar dobles envios por re-render o Strict Mode.
    saveProductViewRecord(productoId, currentTimestamp);

    axiosClient
      .post(`/api/producto-metricas/${encodeURIComponent(productoId)}/vista`, {})
      .catch(() => {
        // Error silencioso: una metrica fallida no debe romper el detalle del producto.
      });
  }, [productoId]);
}
