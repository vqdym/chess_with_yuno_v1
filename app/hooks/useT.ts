import en from "../locales/en.json";
import uk from "../locales/uk.json";
import { useAppSelector } from "@/store/hooks";
import type { Language } from "@/store/settingsSlice";

type Dictionary = typeof en;

const dictionaries: Record<Language, Dictionary> = { en, uk };

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TextKey = Paths<Dictionary>;

function lookup(obj: unknown, path: string): string | undefined {
  const value = path
    .split(".")
    .reduce<any>((o, key) => o?.[key], obj);
  return typeof value === "string" ? value : undefined;
}

export function useT() {
  const language = useAppSelector((s) => s.settings.language);
  return (key: TextKey): string =>
    lookup(dictionaries[language], key) ?? lookup(en, key) ?? key;
}