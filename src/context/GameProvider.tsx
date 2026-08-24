import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";

import GameContext, { GameMode } from "./GameContext";
import { getTodayKey } from "@/utils/prng";

const CHARACTER_STORAGE_KEY = "@BouncyBacon:Character";
const HIGHSCORE_STORAGE_KEY = "@BouncyBacon:Highscore";
const DAILY_BEST_STORAGE_KEY = "@BouncyBacon:DailyBest";

const defaultCharacter = "chicken";
const defaultHighscore = 0;
const defaultDailyBest = 0;

function normalizeHighscore(value: unknown): number {
  const score = Number(value);
  return Number.isFinite(score) && score >= 0 ? score : 0;
}

function normalizeDailyBest(value: unknown): number {
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

async function readDailyBestMapAsync(): Promise<Record<string, unknown>> {
  const item = await AsyncStorage.getItem(DAILY_BEST_STORAGE_KEY);
  if (item === null || item === undefined) {
    return {};
  }
  const parsed = JSON.parse(item);
  if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
    return parsed as Record<string, unknown>;
  }
  return {};
}

async function cacheDailyBestAsync(dailyBest: number): Promise<void> {
  try {
    const all = await readDailyBestMapAsync();
    const todayKey = getTodayKey();
    all[todayKey] = Math.max(normalizeDailyBest(all[todayKey]), dailyBest);
    await AsyncStorage.setItem(DAILY_BEST_STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.warn("Failed to persist daily best", error);
  }
}

async function rehydrateDailyBestAsync(): Promise<number> {
  if (!AsyncStorage) {
    return defaultDailyBest;
  }
  try {
    const all = await readDailyBestMapAsync();
    return normalizeDailyBest(all[getTodayKey()]);
  } catch (error) {
    console.warn("Failed to load daily best", error);
    return defaultDailyBest;
  }
}

export default function GameProvider({ children }) {
  const [character, setCharacter] = React.useState(defaultCharacter);
  const [highscore, setHighscore] = React.useState(defaultHighscore);
  const [mode, setMode] = React.useState<GameMode>("classic");
  const [dailyBest, setDailyBestState] = React.useState(defaultDailyBest);

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

  React.useEffect(() => {
    let isMounted = true;
    const loadDailyBestAsync = async () => {
      try {
        const storedDailyBest = await rehydrateDailyBestAsync();
        if (isMounted) {
          setDailyBestState(storedDailyBest);
        }
      } catch (error) {
        console.warn("Failed to rehydrate daily best", error);
      }
    };

    loadDailyBestAsync();

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
        setDailyBest: (score: number) => {
          const normalized = normalizeDailyBest(score);
          const next = Math.max(dailyBest, normalized);
          setDailyBestState(next);
          cacheDailyBestAsync(next);
        },
      }}
    >
      {children}
    </GameContext>
  );
}
