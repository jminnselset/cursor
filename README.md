# Retro Klokke · Læringsapp

En retro-inspirert læringsapp for å øve på å lese den **analoge klokka** på norsk (bokmål).

![Retro Klokke](public/klokke.svg)

## Funksjoner

- **Analog klokke** tegnet i SVG med neon/retro-stil (CRT-scanlines, glow, piksel-font).
- **Øv-modus** – vis en tilfeldig klokke og avslør svaret som norsk klokkeuttrykk (f.eks. «klokka er halv ett») pluss digital tid.
- **Quiz-modus** – flervalgsspørsmål med poeng, rekke (streak) og beste rekke.
- **Vanskelighetsgrader**: Hele timer, Halve timer, Kvarter og Fem minutter.
- Korrekt norsk klokkeuttrykk, inkludert «over», «på», «halv», «kvart».

## Teknologi

- [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for utvikling og bygg
- ESLint for linting

## Kom i gang

Krever [Node.js](https://nodejs.org/) 18+ (utviklet på Node 22).

```bash
npm install      # installer avhengigheter
npm run dev      # start utviklingsserver på http://localhost:5173
```

### Andre kommandoer

```bash
npm run build      # typesjekk + produksjonsbygg til dist/
npm run preview    # forhåndsvis produksjonsbygg
npm run lint       # kjør ESLint
npm run typecheck  # kjør TypeScript uten å bygge
```

## Prosjektstruktur

```
src/
  App.tsx          # hovedkomponent: faner, nivåer, Øv- og Quiz-modus
  AnalogClock.tsx  # SVG analog klokke (retro neon)
  time.ts          # tidsgenerering + norsk klokkeuttrykk
  App.css          # retro-stil for appen
  index.css        # globale stiler / farger
```

## Norsk klokkeuttrykk

Appen bruker standard norsk måte å lese klokka på, der «halv» viser til **neste** time:

| Tid  | Uttrykk               |
| ---- | --------------------- |
| 12:00 | klokka er tolv        |
| 12:15 | kvart over tolv       |
| 12:20 | ti på halv ett        |
| 12:30 | halv ett              |
| 12:40 | ti over halv ett      |
| 12:45 | kvart på ett          |
| 12:55 | fem på ett            |
