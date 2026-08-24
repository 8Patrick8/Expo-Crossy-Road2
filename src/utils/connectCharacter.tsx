import React from "react";

import GameContext from "../context/GameContext";

// Higher-order component that injects the selected character (and its setter)
// from GameContext into a wrapped component. This replaces the original
// Redux-based `connectCharacter` after the app moved to React Context.
export default function connectCharacter(WrappedComponent) {
  return function ConnectedCharacter(props) {
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
