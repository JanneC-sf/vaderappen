// Kommunikation med OpenWeatherMaps gratis-API:er.
// Nyckeln läses från miljövariabeln VITE_OPENWEATHER_API_KEY (.env.local).

const API_KEY = (import.meta.env.VITE_OPENWEATHER_API_KEY || '').trim()
const BASE = 'https://api.openweathermap.org'

export const hasApiKey = API_KEY.length > 0

export class WeatherError extends Error {
  constructor(message, kind) {
    super(message)
    this.kind = kind
  }
}

export const MISSING_KEY_MESSAGE =
  'Ingen API-nyckel hittades. Lägg in VITE_OPENWEATHER_API_KEY=din-nyckel i filen .env.local och starta om utvecklingsservern.'

async function request(path, params) {
  if (!hasApiKey) throw new WeatherError(MISSING_KEY_MESSAGE, 'missing-key')

  const url = new URL(path, BASE)
  Object.entries({ ...params, appid: API_KEY }).forEach(([k, v]) => url.searchParams.set(k, v))

  let res
  try {
    res = await fetch(url)
  } catch {
    throw new WeatherError('Kunde inte nå vädertjänsten. Kontrollera din internetanslutning och försök igen.', 'network')
  }

  if (res.status === 401) {
    throw new WeatherError(
      'API-nyckeln fungerar inte. Kontrollera att nyckeln i .env.local är rätt. En nyskapad nyckel kan ta upp till ett par timmar innan den aktiveras.',
      'invalid-key',
    )
  }
  if (res.status === 429) {
    throw new WeatherError('För många anrop just nu. Vänta en stund och försök igen.', 'rate-limit')
  }
  if (!res.ok) {
    throw new WeatherError(`Något gick fel hos vädertjänsten (felkod ${res.status}). Försök igen senare.`, 'http')
  }
  return res.json()
}

// Sök orter med Geocoding-API:t
export async function searchPlaces(query) {
  const data = await request('/geo/1.0/direct', { q: query, limit: 5 })
  return data.map((p) => ({
    name: p.local_names?.sv || p.name,
    state: p.state || '',
    country: p.country,
    lat: p.lat,
    lon: p.lon,
  }))
}

export async function getCurrentWeather({ lat, lon }) {
  return request('/data/2.5/weather', { lat, lon, units: 'metric', lang: 'sv' })
}

// Hämtar 5-dygnsprognosen (3-timmarsintervall) och sammanfattar den per dag
export async function getForecast({ lat, lon }) {
  const data = await request('/data/2.5/forecast', { lat, lon, units: 'metric', lang: 'sv' })
  return summarizeDays(data)
}

// Datumnyckel (ÅÅÅÅ-MM-DD) i ortens lokala tid
function localDateKey(unixSeconds, tzOffset) {
  return new Date((unixSeconds + tzOffset) * 1000).toISOString().slice(0, 10)
}

function localHour(unixSeconds, tzOffset) {
  return new Date((unixSeconds + tzOffset) * 1000).getUTCHours()
}

function summarizeDays(data) {
  const tz = data.city?.timezone ?? 0
  const days = new Map()

  for (const item of data.list) {
    const key = localDateKey(item.dt, tz)
    if (!days.has(key)) days.set(key, [])
    days.get(key).push(item)
  }

  const todayKey = localDateKey(Math.floor(Date.now() / 1000), tz)
  let entries = [...days.entries()]
  // Visa de kommande dagarna; ta bara med idag om det annars blir för få
  if (entries.length > 5) entries = entries.filter(([key]) => key !== todayKey)

  return entries.slice(0, 5).map(([key, items]) => {
    // Välj den mätpunkt som ligger närmast mitt på dagen för ikon och beskrivning
    const midday = items.reduce((best, it) =>
      Math.abs(localHour(it.dt, tz) - 13) < Math.abs(localHour(best.dt, tz) - 13) ? it : best,
    )
    const pop = Math.max(...items.map((it) => it.pop ?? 0))
    return {
      date: key,
      min: Math.min(...items.map((it) => it.main.temp_min)),
      max: Math.max(...items.map((it) => it.main.temp_max)),
      icon: midday.weather[0].icon,
      description: midday.weather[0].description,
      pop: Math.round(pop * 100),
      isToday: key === todayKey,
    }
  })
}

export function iconUrl(icon, size = '2x') {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`
}
