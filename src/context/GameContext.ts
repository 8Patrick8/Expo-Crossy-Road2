import { createContext } from "react";

export default createContext({
  character: "chicken",
  setCharacter(_id: string) {},
  highscore: 0,
  setHighscore(_score: number) {},
  resetHighscore() {},
});
