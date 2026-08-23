import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

import GameContext from "./GameContext";

const CHARACTER_STORAGE_KEY = "@BouncyBacon:Character";
const HIGHSCORE_STORAGE_KEY = "@BouncyBacon:Highscore";
const SHOULD_REHYDRATE = true;

const defaultState = { character: "chicken", highscore: 0 };

function normalizeHighscore(value) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

async function cacheCharacterAsync(value) {
  await AsyncStorage.setItem(CHARACTER_STORAGE_KEY, JSON.stringify(value));
}

async function cacheHighscoreAsync(value) {
  await AsyncStorage.setItem(HIGHSCORE_STORAGE_KEY, String(value));
}

async function rehydrateCharacterAsync() {
  if (!SHOULD_REHYDRATE || !AsyncStorage) {
    return defaultState.character;
  }
  try {
    const item = await AsyncStorage.getItem(CHARACTER_STORAGE_KEY);
    if (item == null) {
      return defaultState.character;
    }
    const data = JSON.parse(item);
    return typeof data === "string" ? data : defaultState.character;
  } catch (error) {
    console.warn("Failed to rehydrate character from AsyncStorage:", error);
    return defaultState.character;
  }
}

async function rehydrateHighscoreAsync() {
  if (!SHOULD_REHYDRATE || !AsyncStorage) {
    return defaultState.highscore;
  }
  try {
    const item = await AsyncStorage.getItem(HIGHSCORE_STORAGE_KEY);
    if (item == null) {
      return defaultState.highscore;
    }
    return normalizeHighscore(Number(item));
  } catch (error) {
    console.warn("Failed to rehydrate highscore from AsyncStorage:", error);
    return defaultState.highscore;
  }
}

export default function GameProvider({ children }) {
  const [character, setCharacter] = React.useState(defaultState.character);
  const [highscore, setHighscore] = React.useState(defaultState.highscore);

  React.useEffect(() => {
    const rehydrateAsync = async () => {
      try {
        const [storedCharacter, storedHighscore] = await Promise.all([
          rehydrateCharacterAsync(),
          rehydrateHighscoreAsync(),
        ]);
        setCharacter(storedCharacter);
        setHighscore(storedHighscore);
      } catch (error) {
        console.warn("Failed to rehydrate GameContext state:", error);
      }
    };

    rehydrateAsync();
  }, []);

  return (
    <GameContext
      value={{
        character,
        setCharacter: (character) => {
          setCharacter(character);
          cacheCharacterAsync(character);
        },
        highscore,
        setHighscore: (score) => {
          const normalized = normalizeHighscore(score);
          setHighscore(normalized);
          cacheHighscoreAsync(normalized);
        },
        resetHighscore: () => {
          setHighscore(0);
          cacheHighscoreAsync(0);
        },
      }}
    >
      {children}
    </GameContext>
  );
}
