import { useEffect, useState } from 'react'

const STORAGE_KEY = 'solkollen.favoriter'

export function placeId(place) {
  return `${place.lat.toFixed(3)},${place.lon.toFixed(3)}`
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // localStorage kan vara blockerat (t.ex. privat läge) – appen fungerar ändå
    }
  }, [favorites])

  const isFavorite = (place) => favorites.some((f) => placeId(f) === placeId(place))

  const toggleFavorite = (place) => {
    setFavorites((prev) =>
      prev.some((f) => placeId(f) === placeId(place))
        ? prev.filter((f) => placeId(f) !== placeId(place))
        : [...prev, { name: place.name, state: place.state, country: place.country, lat: place.lat, lon: place.lon }],
    )
  }

  const removeFavorite = (place) => setFavorites((prev) => prev.filter((f) => placeId(f) !== placeId(place)))

  return { favorites, isFavorite, toggleFavorite, removeFavorite }
}
