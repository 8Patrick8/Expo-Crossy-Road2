import { createContext } from "react";

export type GameMode = "classic" | "daily";

export interface GameContextValue {
  character: string;
  setCharacter: (id: string) => void;
  highscore: number;
  setHighscore: (score: number) => void;
  resetHighscore: () => void;
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  dailyBest: number;
  setDailyBest: (score: number) => void;
}

const GameContext = createContext<GameContextValue>({
  character: "chicken",
  setCharacter(_id: string) {},
  highscore: 0,
  setHighscore(_score: number) {},
  resetHighscore() {},
  mode: "classic",
  setMode(_mode: GameMode) {},
  dailyBest: 0,
  setDailyBest(_score: number) {},
});

export default GameContext;
