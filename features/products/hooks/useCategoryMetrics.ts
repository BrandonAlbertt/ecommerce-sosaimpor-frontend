"use client";

// ============================================================
// HOOK PARA METRICAS DE CATEGORIA
// ============================================================
// Registra una vista real cuando el usuario selecciona una categoria o filtro.
// No usa context, providers ni estado global: solo categoriaId, useEffect y localStorage.
//
// Flujo:
// 1. El padre que controla el Home llama a este hook con la categoria seleccionada.
// 2. Este hook revisa si esa categoria ya registro vista recientemente.
// 3. Si pasaron 30 minutos, vuelve a enviar POST al backend.

import { useEffect } from "react";

import { axiosClient } from "@/lib/axiosClient";

type CategoryViewRecord = {
  categoriaId: number;
  timestamp: number;
};

const categoryViewStoragePrefix = "sosaimpor:categoria-vista";
const categoryViewIntervalMs = 30 * 60 * 1000;

function getCategoryViewStorageKey(categoriaId: number) {
  return `${categoryViewStoragePrefix}:${categoriaId}`;
}

function readCategoryViewRecord(categoriaId: number) {
  try {
    const savedValue = localStorage.getItem(getCategoryViewStorageKey(categoriaId));

    if (!savedValue) {
      return null;
    }

    const parsedValue = JSON.parse(savedValue) as Partial<CategoryViewRecord>;

    if (parsedValue.categoriaId !== categoriaId || typeof parsedValue.timestamp !== "number") {
      return null;
    }

    return parsedValue as CategoryViewRecord;
  } catch {
    return null;
  }
}

function saveCategoryViewRecord(categoriaId: number, timestamp: number) {
  try {
    const record: CategoryViewRecord = {
      categoriaId,
      timestamp,
    };

    localStorage.setItem(getCategoryViewStorageKey(categoriaId), JSON.stringify(record));
  } catch {
    // Si el navegador bloquea localStorage, la tienda debe seguir funcionando.
  }
}

function shouldRegisterCategoryView(record: CategoryViewRecord | null, currentTimestamp: number) {
  if (!record) {
    return true;
  }

  return currentTimestamp - record.timestamp >= categoryViewIntervalMs;
}

export function useCategoryMetrics(categoriaId: number | null | undefined) {
  useEffect(() => {
    if (!categoriaId) {
      return;
    }

    const currentTimestamp = Date.now();
    const savedRecord = readCategoryViewRecord(categoriaId);

    if (!shouldRegisterCategoryView(savedRecord, currentTimestamp)) {
      return;
    }

    // Guardamos antes del POST para evitar dobles envios por re-render o Strict Mode.
    saveCategoryViewRecord(categoriaId, currentTimestamp);

    axiosClient
      .post(`/api/categoria-metricas/${encodeURIComponent(categoriaId)}/vista`, {})
      .catch(() => {
        // Error silencioso: una metrica fallida no debe romper el Home.
      });
  }, [categoriaId]);
}
