import { useState } from 'react'
import { searchPlaces } from '../api.js'

export default function SearchBar({ onSelect, onError }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [searching, setSearching] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setSearching(true)
    setResults(null)
    try {
      const places = await searchPlaces(q)
      if (places.length === 1) {
        choose(places[0])
      } else {
        setResults(places)
      }
    } catch (err) {
      onError(err)
    } finally {
      setSearching(false)
    }
  }

  function choose(p) {
    setResults(null)
    setQuery('')
    onSelect(p)
  }

  return (
    <section className="search" aria-label="Sök ort">
      <form onSubmit={handleSubmit} className="search-form" role="search">
        <label htmlFor="search-input" className="visually-hidden">
          Ort
        </label>
        <input
          id="search-input"
          type="search"
          placeholder="Sök ort, t.ex. Täby"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? 'Söker…' : 'Sök'}
        </button>
      </form>

      {results && results.length === 0 && (
        <p className="message">Ingen ort hittades med det namnet. Prova att stava på ett annat sätt.</p>
      )}

      {results && results.length > 1 && (
        <ul className="results" aria-label="Sökträffar">
          {results.map((p) => (
            <li key={`${p.lat},${p.lon}`}>
              <button type="button" className="result-btn" onClick={() => choose(p)}>
                <span className="result-name">{p.name}</span>
                <span className="muted">{[p.state, p.country].filter(Boolean).join(', ')}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
