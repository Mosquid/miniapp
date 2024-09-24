"use client";

// src/Game.tsx
import { useState, useRef, FC, useEffect } from "react";
import { Stage, Container, Graphics, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { random } from "lodash";
import styles from "./game.module.css";
import { GameStatus } from "./types";
import Controls from "./Controls";
import Score from "./Score";

export interface GameProps {
  onStop: () => void;
}

const INCREMENT = 25;

function getPointCoordinates(
  point: number,
  index: number,
  canvasHeight: number
) {
  const x = index * 5;
  // base is the middle of the canvas
  const base = canvasHeight / 2;
  const y = base - point;

  return { x, y };
}

const Game: FC<GameProps> = ({ onStop }) => {
  const windowWidth = window.innerWidth;
  const gameRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(
    gameRef.current?.clientHeight || 0
  );
  const [gameStatus, setGameStatus] = useState(GameStatus.pending);
  const [points, setPoints] = useState<Array<number>>([0]);
  const maxPoints = 120;
  const textStyle = new TextStyle({
    fill: "white",
  });

  if (gameRef.current && !windowHeight) {
    setWindowHeight(gameRef.current.clientHeight);
  }

  // Reference for animation frame
  const animationRef = useRef<NodeJS.Timeout>();

  // Canvas dimensions
  const canvasWidth = windowWidth || gameRef.current?.clientWidth || 0;
  const canvasHeight = windowHeight;
  const base = canvasHeight / 2;

  useEffect(() => {
    if (!windowHeight) {
      setWindowHeight(gameRef.current?.clientHeight || 0);
    }
  }, [windowHeight]);

  // Function to start the game loop
  const startGame = () => {
    const addPoint = async () => {
      setPoints((prevPoints) => {
        const lastPoint = prevPoints[prevPoints.length - 1];
        const rand = random(-1 * INCREMENT, INCREMENT);
        const newPoint = lastPoint + rand;

        return [...prevPoints, newPoint];
      });

      if (points.length >= maxPoints) {
        setGameStatus(GameStatus.ended);
      }

      // Continue the loop
      if (gameStatus === GameStatus.running) {
        animationRef.current = setTimeout(addPoint, 50);
        // animationRef.current = requestAnimationFrame(addPoint);
      }
    };

    animationRef.current = setTimeout(addPoint, 0);
  };

  // Start the game loop when the component mounts
  useEffect(() => {
    if (gameStatus === GameStatus.running) {
      startGame();
    }

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [gameStatus]);

  // Function to handle quitting the game
  const quitGame = () => {
    setGameStatus(GameStatus.ended);
  };

  // Calculate the offset to make the camera follow the last point
  const earning = points[points.length - 1];
  const offsetX = Math.min(
    10,
    canvasWidth * 0.9 -
      getPointCoordinates(0, points.length - 1, canvasHeight).x
  );

  useEffect(() => {
    if (gameStatus === GameStatus.running && points.length >= maxPoints) {
      quitGame();
    }
  }, [points.length]);

  const lineColor = earning < 0 ? 0xff0000 : 0x00ff00;
  const displayScore = Number(earning).toFixed(2);
  const handleCtaClick = () => {
    if (gameStatus === GameStatus.pending) {
      setGameStatus(GameStatus.running);
      return;
    }

    if (gameStatus === GameStatus.running) {
      setGameStatus(GameStatus.ended);
      return;
    }
  };

  const firstPoint = getPointCoordinates(points[0], 0, canvasHeight);

  return (
    <div className={styles.root}>
      <div ref={gameRef} className={styles.stage}>
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          options={{ backgroundColor: 0x000000 }}
        >
          <Container position={[offsetX, 0]}>
            <Graphics
              draw={(g) => {
                g.clear();
                g.lineStyle(2, lineColor);

                // Draw the line chart
                g.moveTo(firstPoint.x, firstPoint.y);

                points.forEach((point, index) => {
                  const coordinates = getPointCoordinates(
                    point,
                    index,
                    canvasHeight
                  );
                  g.lineTo(coordinates.x, coordinates.y);
                });
              }}
            />
            {/* Draw X-axis */}
            <Graphics
              draw={(g) => {
                g.lineStyle(1, 0xffffff);
                g.moveTo(firstPoint.x, base); // Adjust starting point based on offset
                g.lineTo(
                  getPointCoordinates(
                    points[points.length - 1],
                    points.length,
                    canvasHeight
                  ).x * 2,
                  base
                );
              }}
            />
            <Text
              tint={0xffffff}
              text={displayScore}
              x={
                getPointCoordinates(
                  points[points.length - 1],
                  points.length,
                  canvasHeight
                ).x
              }
              y={base}
              style={textStyle}
            />
          </Container>
        </Stage>
      </div>
      <Controls onClick={handleCtaClick} points={earning} status={gameStatus} />
      {gameStatus === GameStatus.ended && (
        <Score points={earning} currency="YCN" onClick={onStop} />
      )}
    </div>
  );
};

export default Game;
