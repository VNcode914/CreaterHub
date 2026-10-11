import { createContext, useContext } from 'react'

export type StudioContextValue = {
  query: string
  setQuery: (value: string) => void
  notice: string | null
  setNotice: (value: string | null) => void
}

export const StudioContext = createContext<StudioContextValue | null>(null)

export function useStudio() {
  const ctx = useContext(StudioContext)
  if (!ctx) {
    throw new Error('useStudio must be used inside StudioProvider')
  }
  return ctx
}
