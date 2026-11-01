import { useEffect, useRef, useState } from 'react'
import { getCurrentWeather, getForecast, hasApiKey, MISSING_KEY_MESSAGE } from './api.js'
import { useFavorites, placeId } from './useFavorites.js'
import SearchBar from './components/SearchBar.jsx'
import Favorites from './components/Favorites.jsx'
import CurrentWeather from './components/CurrentWeather.jsx'
import Forecast from './components/Forecast.jsx'

export default function App() {
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites()
  const [place, setPlace] = useState(null)
  const [current, setCurrent] = useState(null)
  const [days, setDays] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const requestId = useRef(0)

  async function showPlace(p) {
    const id = ++requestId.current
    setPlace(p)
    setLoading(true)
    setError(null)
    try {
      const [cur, fc] = await Promise.all([getCurrentWeather(p), getForecast(p)])
      if (id !== requestId.current) return
      setCurrent(cur)
      setDays(fc)
    } catch (err) {
      if (id !== requestId.current) return
      setError(err)
      setCurrent(null)
      setDays([])
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }

  // Visa första favoriten direkt när appen öppnas
  useEffect(() => {
    if (hasApiKey && favorites.length > 0) showPlace(favorites[0])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="app">
      <header className="app-header">
        <img src="./favicon.svg" alt="" className="logo" width="48" height="48" />
        <div>
          <h1>Solkollen</h1>
          <p className="tagline">Vädret just nu och fem dagar framåt</p>
        </div>
      </header>

      {!hasApiKey ? (
        <div className="message message-error" role="alert">
          <strong>API-nyckel saknas.</strong> {MISSING_KEY_MESSAGE}
        </div>
      ) : (
        <>
          <SearchBar onSelect={showPlace} onError={setError} />

          <Favorites
            favorites={favorites}
            activeId={place ? placeId(place) : null}
            onSelect={showPlace}
            onRemove={removeFavorite}
          />

          <main>
            {error && (
              <div className="message message-error" role="alert">
                {error.message}
              </div>
            )}

            {loading && (
              <div className="message" role="status">
                <span className="spinner" aria-hidden="true" /> Hämtar vädret…
              </div>
            )}

            {!loading && !error && current && place && (
              <>
                <CurrentWeather
                  place={place}
                  data={current}
                  favorite={isFavorite(place)}
                  onToggleFavorite={() => toggleFavorite(place)}
                />
                <Forecast days={days} />
              </>
            )}

            {!loading && !error && !current && (
              <div className="welcome">
                <p className="welcome-emoji" aria-hidden="true">🌤️</p>
                <p>Sök efter en ort för att se hur vädret blir!</p>
                <p className="muted">Tryck på stjärnan för att spara orten som favorit.</p>
              </div>
            )}
          </main>
        </>
      )}

      <footer className="app-footer">
        Väderdata från <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">OpenWeatherMap</a>
      </footer>
    </div>
  )
}
