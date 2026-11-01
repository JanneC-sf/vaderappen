import { iconUrl } from '../api.js'

function dayLabel(dateKey, isToday) {
  if (isToday) return 'Idag'
  const label = new Date(`${dateKey}T12:00:00Z`).toLocaleDateString('sv-SE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export default function Forecast({ days }) {
  if (days.length === 0) return null

  return (
    <section aria-label="Prognos för kommande dagar">
      <h2 className="section-title">Kommande dagar</h2>
      <ol className="forecast">
        {days.map((d) => (
          <li key={d.date} className="card day">
            <p className="day-name">{dayLabel(d.date, d.isToday)}</p>
            <img src={iconUrl(d.icon)} alt={d.description} width="64" height="64" />
            <p className="day-temps">
              <span className="max">{Math.round(d.max)}°</span>
              <span className="min">{Math.round(d.min)}°</span>
            </p>
            <p className="day-pop" title="Risk för nederbörd">💧 {d.pop} %</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
