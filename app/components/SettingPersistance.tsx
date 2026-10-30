"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hydrateSettings } from "@/store/settingsSlice";

const STORAGE_KEY = "chess-settings";

export function SettingsPersistence() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector((state) => state.settings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch(hydrateSettings(JSON.parse(raw)));
    } catch {
    }
    setHydrated(true);
  }, [dispatch]);


  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings, hydrated]);

  return null;
}