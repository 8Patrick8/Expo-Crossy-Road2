import React, { ComponentType } from "react";

import GameContext from "../context/GameContext";

interface CharacterProps {
  character: string;
  setCharacter: (id: string) => void;
}

// Higher-order component that injects the selected character (and its setter)
// from GameContext into a wrapped component. This replaces the original
// Redux-based `connectCharacter` after the app moved to React Context.
export default function connectCharacter<P extends object>(
  WrappedComponent: ComponentType<P & CharacterProps>
) {
  return function ConnectedCharacter(props: P) {
    const { character, setCharacter } = React.useContext(GameContext);
    return (
      <WrappedComponent
        {...props}
        character={character}
        setCharacter={setCharacter}
      />
    );
  };
}
