"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useUserStore } from "@/stores/useUserStore";

export function StoreInitializer() {
  const initializeCategories = useCategoryStore(
    (state) => state.initializeDefaultCategories
  );
  const initializeBadges = useUserStore((state) => state.initializeBadges);

  useEffect(() => {
    initializeCategories();
    initializeBadges();
  }, [initializeCategories, initializeBadges]);

  return null;
}
