# AGENTS.md – Solkollen

## Vad appen gör

Solkollen är en enkel väderapp på svenska. Man söker efter en ort och ser:

- vädret just nu: temperatur, känns som, vind, luftfuktighet, soluppgång och solnedgång
- en prognos för fem dagar framåt med högsta och lägsta temperatur och risk för nederbörd
- favoritorter, som sparas i webbläsarens `localStorage` under nyckeln `solkollen.favoriter`

Väderdata kommer från OpenWeatherMaps gratis-API:er (Current Weather, 5 Day / 3 Hour Forecast och Geocoding).

## Teknik

- React 19 och Vite 7, ren JavaScript (JSX) utan TypeScript
- Ingen backend: appen anropar OpenWeatherMap direkt från webbläsaren
- Publiceras på GitHub Pages via `.github/workflows/deploy.yml` vid varje push till `main`

## Struktur

- `src/App.jsx` – huvudkomponent med state för vald ort, aktuellt väder och prognos
- `src/api.js` – alla anrop till OpenWeatherMap och felhantering (`WeatherError`)
- `src/useFavorites.js` – hook för favoriter i `localStorage`
- `src/components/` – `SearchBar`, `Favorites`, `CurrentWeather`, `Forecast`
- `src/index.css` – all styling
- `vite.config.js` – `base: './'` så att appen fungerar från en undermapp (GitHub Pages)

## Starta

1. Kopiera `.env.example` till `.env.local` och fyll i `VITE_OPENWEATHER_API_KEY=din-nyckel`.
   Starta om utvecklingsservern om du ändrar nyckeln.
2. Kör:
   ```bash
   npm install
   npm run dev
   ```
   Appen körs på http://localhost:5173 (finns också som `dev` i `.claude/launch.json`).

Bygg för publicering med `npm run build` (resultatet hamnar i `dist/`) och förhandsgranska bygget med `npm run preview`.

## Testa

Projektet har inga automatiska tester och ingen linter ännu. Testa därför manuellt i webbläsaren:

- sök efter en ort och kontrollera att väder och femdagarsprognos visas
- lägg till och ta bort en favorit och ladda om sidan för att se att den finns kvar
- kontrollera felmeddelanden, till exempel utan API-nyckel eller med en ogiltig ort
- kontrollera att layouten fungerar i mobilbredd
- kör `npm run build` och kontrollera att bygget går igenom

## Viktigt att tänka på

- Checka aldrig in `.env.local` eller en riktig API-nyckel. I GitHub Actions hämtas nyckeln från hemligheten `VITE_OPENWEATHER_API_KEY`.
- Vite bygger in nyckeln i JavaScript-filerna, så den syns för alla besökare. Använd bara en gratisnyckel.
- All text som användaren ser är på svenska. Felmeddelanden finns samlade i `src/api.js`.

## Arbetssätt

- Jobba alltid på en ny branch, aldrig direkt på main.
- Kör testerna innan du öppnar en pull request. De ska gå igenom.
  Finns inga tester än, kör minst `npm run build` och testa manuellt enligt avsnittet Testa.
- När du är klar: pusha branchen och öppna en pull request med gh.
