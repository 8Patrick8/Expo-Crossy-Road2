import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

import GameContext, { GameMode } from "./GameContext";

const CHARACTER_STORAGE_KEY = "@BouncyBacon:Character";
const HIGHSCORE_STORAGE_KEY = "@BouncyBacon:Highscore";

const defaultCharacter = "chicken";
const defaultHighscore = 0;

function normalizeHighscore(value: unknown): number {
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 ? score : 0;
}

async function cacheCharacterAsync(character: string): Promise<void> {
  try {
    await AsyncStorage.setItem(CHARACTER_STORAGE_KEY, character);
  } catch (error) {
    console.warn("Failed to persist character", error);
  }
}

async function cacheHighscoreAsync(highscore: number): Promise<void> {
  try {
    await AsyncStorage.setItem(HIGHSCORE_STORAGE_KEY, String(highscore));
  } catch (error) {
    console.warn("Failed to persist highscore", error);
  }
}

async function rehydrateHighscoreAsync(): Promise<number> {
  if (!AsyncStorage) {
    return defaultHighscore;
  }
  try {
    const item = await AsyncStorage.getItem(HIGHSCORE_STORAGE_KEY);
    if (item === null || item === undefined) {
      return defaultHighscore;
    }
    return normalizeHighscore(item);
  } catch (error) {
    console.warn("Failed to load highscore", error);
    return defaultHighscore;
  }
}

export default function GameProvider({ children }) {
  const [character, setCharacter] = React.useState(defaultCharacter);
  const [highscore, setHighscore] = React.useState(defaultHighscore);
  const [mode, setMode] = React.useState<GameMode>("classic");
  const [dailyBest] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    const loadHighscoreAsync = async () => {
      try {
        const storedHighscore = await rehydrateHighscoreAsync();
        if (isMounted) {
          setHighscore(storedHighscore);
        }
      } catch (error) {
        console.warn("Failed to rehydrate highscore", error);
      }
    };

    loadHighscoreAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <GameContext
      value={{
        character,
        setCharacter: (id: string) => {
          setCharacter(id);
          cacheCharacterAsync(id);
        },
        highscore,
        setHighscore: (score: number) => {
          const normalized = normalizeHighscore(score);
          setHighscore(normalized);
          cacheHighscoreAsync(normalized);
        },
        resetHighscore: () => {
          setHighscore(0);
          cacheHighscoreAsync(0);
        },
        mode,
        setMode,
        dailyBest,
        setDailyBest: (_score: number) => {
          // No-op stub: persistence and maximum logic land in the
          // "Tages-Bestwert speichern" ticket.
        },
      }}
    >
      {children}
    </GameContext>
  );
}
