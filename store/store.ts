import { configureStore } from '@reduxjs/toolkit'
import settingsReducer from './settingsSlice';
import gameStateReducer from './gameSlice';
import chessReducer from './chessSlice'

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    gameState: gameStateReducer,
    chess: chessReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
