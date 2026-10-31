import type { Theme } from "@/app/types/Theme";
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
}

const initialState: SettingsState = {
  boardTheme: 'wood',
  masterVolume: 100,
  musicVolume: 60,
  rainVolume: 35,
  voiceEffectsVolume: 100,
  language: "en",
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
      return {...state, ...action.payload};
    },
    setVoiceEffectsVolume: (state, action: PayloadAction<{voiceEffectsVolume: number}>) => {
      state.voiceEffectsVolume = action.payload.voiceEffectsVolume;
    },
    setLanguage: (state, action: PayloadAction<{ language: Language }>) => {
      state.language = action.payload.language;
    },
  }
})

export const {setBoardTheme, setMasterVolume, setMusicVolume, setRainVolume, setVoiceEffectsVolume, hydrateSettings, setLanguage} = settingsSlice.actions;
export default settingsSlice.reducer;
