"use client"

import { Provider } from 'react-redux'
import { store } from './store'
import { SettingsPersistence } from '@/app/components/SettingPersistance'

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>
    <SettingsPersistence />
    {children}</Provider>
} 