import { useEffect, useState } from 'react'

const STORAGE_KEY = 'opportunityhub-bookmarks'

function readBookmarks(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = stored ? JSON.parse(stored) : []
    return Array.isArray(parsed) && parsed.every((id) => typeof id === 'string') ? parsed : []
  } catch {
    return []
  }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>(readBookmarks)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks))
  }, [bookmarks])

  function toggleBookmark(id: string) {
    setBookmarks((current) =>
      current.includes(id) ? current.filter((bookmark) => bookmark !== id) : [...current, id],
    )
  }

  return { bookmarks, toggleBookmark, isBookmarked: (id: string) => bookmarks.includes(id) }
}