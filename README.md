# Poke Explorer Pokédex App

Poke Explorer is an interactive Pokédex built with React Native and Expo. It lets users browse, search, and favorite Pokémon by consuming the public PokéAPI. The application was developed as the final assignment for the Mobile Application Development course at PUCPR and showcases modern mobile patterns such as clean separation of concerns, state management, and asynchronous data fetching.

This project was developed as a final assignment for the Mobile Application Development discipline at the **Pontifical Catholic University of Paraná (PUCPR)**.

## Highlights
- Browse an endless list of Pokémon with an on-demand "Load more" experience.
- Search for any Pokémon by name or Pokédex number directly from the home screen.
- Check a dedicated detail page with artwork, types, abilities, height, and weight.
- Mark Pokémon as favorites and revisit them in a separate list.
- Provide clear feedback with loading, empty, and error states across the app.

## Tech Stack and Architecture
- Framework: Expo (React Native) with TypeScript.
- Navigation: Expo Router using file-based routing in the `app/` directory.
- State management: custom React Context (`FavoritesProvider`) to store the favorites list across screens.
- Data access: Fetch API wrappers in `src/api/pokeApi.ts` that request data from the public PokéAPI and map it to view models.
- UI: Native components styled with `StyleSheet`, focusing on responsive layouts and accessibility-friendly interactions.

## Project Structure
```
app/
  _layout.tsx        # Root stack and shared navigation options
  index.tsx          # Home screen with list, search, and pagination
  favorites.tsx      # Screen with the user's favorite Pokémon
  pokemon/
    [id].tsx         # Detailed information for a selected Pokémon
src/
  api/               # HTTP clients and mappers for PokéAPI
  context/           # Favorites context and provider
  utils/             # Helper functions (text formatting, etc.)
app-example/         # Original Expo starter kept as reference
assets/              # Static assets (icons, fonts, splash)
```

## Getting Started

### Prerequisites
- Node.js 18 or newer.
- npm (bundled with Node.js) or another package manager such as pnpm or yarn.
- Expo Go app on a device or an Android/iOS emulator if you want to preview on simulators.

### Installation
```
git clone https://github.com/Berdegeus/PokeExplorer-ReactNative
cd poke_explorer
npm install
```

### Run the app
Start the Expo development server and choose the desired target (Expo Go, Android emulator, iOS simulator, or web):
```
npx expo start
```

### Additional scripts
- `npm run android` starts the dev server and opens the Android emulator.
- `npm run ios` starts the dev server and opens the iOS simulator.
- `npm run web` runs the project in a browser using React Native Web.
- `npm run lint` validates the code with ESLint.

## API Usage and Limits
The application reads data from the public [PokéAPI](https://pokeapi.co/). No API key is required, but the service imposes rate limits. If requests start failing, wait a moment before trying again.


