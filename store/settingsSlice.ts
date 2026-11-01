import type { Theme } from "@/app/types/Theme";
import { isGraphicsQuality, type GraphicsQuality } from "@/app/globals/graphics";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export const LANGUAGES = ["en", "uk"] as const;
export type Language = (typeof LANGUAGES)[number];

interface SettingsState {
  boardTheme: Theme;
  masterVolume: number;
  musicVolume: number;
  rainVolume: number;
  voiceEffectsVolume: number;
  language: Language;
  graphicsQuality: GraphicsQuality;
  showFps: boolean;
  gpuWarning?: string;
}

const initialState: SettingsState = {
  boardTheme: 'wood',
  masterVolume: 100,
  musicVolume: 60,
  rainVolume: 35,
  voiceEffectsVolume: 100,
  language: "en",
  graphicsQuality: "medium",
  showFps: false,
  gpuWarning: undefined,
} 

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setBoardTheme: (state: SettingsState, action: PayloadAction<{boardTheme: Theme}>) => {
      state.boardTheme = action.payload.boardTheme;
    },
    setMasterVolume: (state: SettingsState, action: PayloadAction<{masterVolume: number}>) => {
      state.masterVolume = action.payload.masterVolume;
    },
    setMusicVolume: (state: SettingsState, action: PayloadAction<{musicVolume: number}>) => {
      state.musicVolume = action.payload.musicVolume;
    },
    setRainVolume: (state: SettingsState, action: PayloadAction<{rainVolume: number}>) => {
      state.rainVolume = action.payload.rainVolume;
    },
    hydrateSettings: (state, action: PayloadAction<Partial<SettingsState>>)=>{
      return {
        ...state, ...action.payload,
        graphicsQuality: isGraphicsQuality(action.payload.graphicsQuality) ? action.payload.graphicsQuality : state.graphicsQuality,
        showFps: typeof action.payload.showFps === "boolean" ? action.payload.showFps : state.showFps,
      };
    },
    setGraphicsQuality: (state, action: PayloadAction<GraphicsQuality>) => {
      if (isGraphicsQuality(action.payload)) state.graphicsQuality = action.payload;
    },
    setShowFps: (state, action: PayloadAction<boolean>) => {
      state.showFps = action.payload;
    },
    setVoiceEffectsVolume: (state, action: PayloadAction<{voiceEffectsVolume: number}>) => {
      state.voiceEffectsVolume = action.payload.voiceEffectsVolume;
    },
    setLanguage: (state, action: PayloadAction<{ language: Language }>) => {
      state.language = action.payload.language;
    },
    setGpuWarning: (state, action: PayloadAction<string | undefined>) => {
      state.gpuWarning = action.payload;
    }
  }
})

export const {setBoardTheme, setMasterVolume, setMusicVolume, setRainVolume, setVoiceEffectsVolume, hydrateSettings, setLanguage, setGraphicsQuality, setShowFps, setGpuWarning} = settingsSlice.actions;
export default settingsSlice.reducer;
