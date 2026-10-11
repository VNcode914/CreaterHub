import { useMemo, useState, type ReactNode } from 'react'
import { StudioContext } from './studio-context'

export function StudioProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState<string | null>(null)

  const value = useMemo(
    () => ({ query, setQuery, notice, setNotice }),
    [query, notice],
  )

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>
}
