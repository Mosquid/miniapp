import { FC, useContext, createContext, useState } from "react";

export interface GameStateContextValue {
  isLoading: boolean;
}

export interface GameStateProviderProps {
  children: React.ReactNode;
  isLoading: boolean;
}

const GameStateContext = createContext<GameStateContextValue>({
  isLoading: false,
});

const GameStateProvider: FC<GameStateProviderProps> = ({
  children,
  isLoading,
}) => {
  return (
    <GameStateContext.Provider value={{ isLoading }}>
      {children}
    </GameStateContext.Provider>
  );
};

export function useGameState() {
  return useContext(GameStateContext);
}

export default GameStateProvider;
