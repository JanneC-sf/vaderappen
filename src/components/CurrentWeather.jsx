import { iconUrl } from '../api.js'

function formatTime(unixSeconds, tzOffset) {
  return new Date((unixSeconds + tzOffset) * 1000).toLocaleTimeString('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  })
}

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export default function CurrentWeather({ place, data, favorite, onToggleFavorite }) {
  const w = data.weather[0]
  const tz = data.timezone ?? 0

  return (
    <section className="card current" aria-label="Vädret just nu">
      <div className="current-top">
        <div>
          <h2 className="place-name">{place.name}</h2>
          <p className="muted">{[place.state, place.country].filter(Boolean).join(', ')}</p>
        </div>
        <button
          type="button"
          className={`btn-star ${favorite ? 'is-favorite' : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={favorite}
          aria-label={favorite ? `Ta bort ${place.name} från favoriter` : `Spara ${place.name} som favorit`}
          title={favorite ? 'Ta bort från favoriter' : 'Spara som favorit'}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>

      <div className="current-main">
        <img src={iconUrl(w.icon, '4x')} alt="" width="120" height="120" className="current-icon" />
        <div>
          <p className="temp">{Math.round(data.main.temp)}°</p>
          <p className="description">{capitalize(w.description)}</p>
        </div>
      </div>

      <dl className="details">
        <div>
          <dt>Känns som</dt>
          <dd>{Math.round(data.main.feels_like)}°</dd>
        </div>
        <div>
          <dt>Vind</dt>
          <dd>{Math.round(data.wind.speed)} m/s</dd>
        </div>
        <div>
          <dt>Luftfuktighet</dt>
          <dd>{data.main.humidity} %</dd>
        </div>
        <div>
          <dt>Sol upp / ner</dt>
          <dd>
            {formatTime(data.sys.sunrise, tz)} / {formatTime(data.sys.sunset, tz)}
          </dd>
        </div>
      </dl>
    </section>
  )
}
