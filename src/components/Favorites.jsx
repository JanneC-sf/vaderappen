import { placeId } from '../useFavorites.js'

export default function Favorites({ favorites, activeId, onSelect, onRemove }) {
  if (favorites.length === 0) return null

  return (
    <nav className="favorites" aria-label="Favoritorter">
      <h2 className="section-title">Favoriter</h2>
      <ul className="chips">
        {favorites.map((f) => {
          const id = placeId(f)
          const active = id === activeId
          return (
            <li key={id} className={`chip ${active ? 'chip-active' : ''}`}>
              <button type="button" className="chip-main" onClick={() => onSelect(f)} aria-current={active ? 'true' : undefined}>
                ⭐ {f.name}
              </button>
              <button type="button" className="chip-remove" onClick={() => onRemove(f)} aria-label={`Ta bort ${f.name} från favoriter`}>
                ×
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
