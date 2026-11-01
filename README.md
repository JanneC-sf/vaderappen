# Solkollen ☀️

En glad och enkel väderapp byggd med React och Vite.

## Vad appen gör

- Sök efter en ort och se vädret just nu: temperatur, känns som, vind, luftfuktighet och soluppgång/solnedgång.
- Se en prognos för de kommande fem dagarna med högsta/lägsta temperatur och risk för nederbörd.
- Spara favoritorter med stjärnan och byt snabbt mellan dem. Favoriterna sparas i webbläsaren (localStorage).
- Fungerar lika bra på mobil som på dator.

Väderdata hämtas från [OpenWeatherMap](https://openweathermap.org/) via deras gratis-API:er
(Current Weather, 5 Day / 3 Hour Forecast och Geocoding).

## Kom igång

1. Skaffa en gratis API-nyckel på [openweathermap.org](https://home.openweathermap.org/api_keys).
2. Kopiera `.env.example` till `.env.local` och fyll i nyckeln:
   ```
   VITE_OPENWEATHER_API_KEY=din-nyckel
   ```
   `.env.local` är undantagen i `.gitignore` och checkas aldrig in.
3. Installera och starta:
   ```bash
   npm install
   npm run dev
   ```

## Bygga för publicering

```bash
npm run build
```

Resultatet hamnar i `dist/`. Eftersom `base` är satt till `./` fungerar appen även från en undermapp, till exempel på GitHub Pages.

> Observera: i en Vite-app byggs nyckeln in i JavaScript-filerna och syns för alla som besöker sidan. Använd därför en gratisnyckel utan betalkoppling.
