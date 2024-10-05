"use client";

// src/Game.tsx
import { useState, useRef, FC, useEffect } from "react";
import { Stage, Container, Graphics, Text, PixiRef } from "@pixi/react";
import { TextStyle, Ticker } from "pixi.js";
import { fill, random, size } from "lodash";
import styles from "./game.module.css";
import { GameStatus } from "./types";
import Controls from "./Controls";
import Score from "./Score";

export interface GameProps {
  onStop: (score: number) => void;
}

const INCREMENT = 25;
const pointSpacing = 5;

function getPointCoordinates(
  point: number,
  index: number,
  canvasHeight: number
) {
  const x = index * pointSpacing;
  // base is the middle of the canvas
  const base = canvasHeight / 2;
  const y = base - point;

  return { x, y };
}

const Game: FC<GameProps> = ({ onStop }) => {
  const ticker = new Ticker();
  const textRef = useRef<PixiRef<typeof Text>>(null);
  const windowWidth = window.innerWidth;
  const gameRef = useRef<HTMLDivElement>(null);
  const [windowHeight, setWindowHeight] = useState(
    gameRef.current?.clientHeight || 0
  );
  const [gameStatus, setGameStatus] = useState(GameStatus.pending);
  const [points, setPoints] = useState<Array<number>>([0]);

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
  const maxPoints = Math.floor(canvasWidth / pointSpacing);
  const base = canvasHeight / 2;
  const [currentCoordinates, setCurrentCoordinates] = useState({
    x: 0,
    y: base || 3,
  });

  useEffect(() => {
    if (!windowHeight) {
      setWindowHeight(gameRef.current?.clientHeight || 0);

      setCurrentCoordinates({
        x: 0,
        y: (gameRef.current?.clientHeight || 0) / 2,
      });
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
        animationRef.current = setTimeout(addPoint, 100);
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
  // const adjustedFirstPoint = { x: firstPoint.x, y: firstPoint.y };

  const currentPoint = getPointCoordinates(
    points[points.length - 1],
    points.length,
    canvasHeight
  );
  const isDotOffScreen = currentPoint.y < 0 || currentPoint.y > canvasHeight;
  const offsetX = Math.min(0, canvasWidth - currentPoint.x);
  const offsetY = isDotOffScreen
    ? Math.max(canvasHeight * 0.1 - currentPoint.y, -canvasHeight * 0.8)
    : 0;

  const endOfChart =
    Math.abs(offsetX) +
    Math.max(canvasWidth, getPointCoordinates(0, points.length - 1, 0).x);

  useEffect(() => {
    if (gameStatus !== GameStatus.running) {
      ticker.stop();
      return;
    }

    ticker.add(() => {
      setCurrentCoordinates((prevPoint) => {
        const speed = 0.25; // Adjust the speed for smoothness
        return {
          x: prevPoint.x + (currentPoint.x - prevPoint.x) * speed,
          y: prevPoint.y + (currentPoint.y - prevPoint.y) * speed,
        };
      });
    });

    ticker.start();

    return () => {
      ticker.stop();
      ticker.destroy();
    };
  }, [currentPoint]);

  return (
    <div className={styles.root}>
      <div ref={gameRef} className={styles.stage}>
        <Stage
          width={canvasWidth}
          height={canvasHeight}
          options={{ backgroundColor: 0x000000 }}
        >
          <Container position={[offsetX, offsetY]}>
            <Graphics
              draw={(g) => {
                g.clear();
                g.lineStyle(1, 0xcccccc);

                const numberOfLines = 14; // Total number of intervals (spaces)
                const spacing = canvasWidth / (numberOfLines - 1); // Spacing to ensure lines are centered
                const centerX = Math.abs(offsetX) + canvasWidth / 2;

                // Adjust starting point to center the lines symmetrically
                const startX =
                  centerX - Math.floor(numberOfLines / 2) * spacing;

                for (let i = 0; i < numberOfLines; i++) {
                  const x = startX + i * spacing;

                  // Thicker line for the center
                  if (Math.abs(x - centerX) < spacing / 2) {
                    g.lineStyle(2, 0xffffff); // Center line
                  } else {
                    g.lineStyle(1, 0xffffff, 0.09); // Normal line
                  }

                  g.moveTo(x, 0);
                  g.lineTo(x, canvasHeight);
                }
              }}
            />
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
            {Array(18)
              .fill("")
              .map((point, index) => {
                const x = 7 + index * Math.floor(canvasWidth / 18);
                return (
                  <Text
                    scale={0.4}
                    style={new TextStyle({ fill: "rgba(255, 255, 255, 0.23)" })}
                    tint={0xffffff}
                    text={String(index + 1)}
                    x={x}
                    y={canvasHeight - 20}
                  />
                );
              })}

            <Graphics
              draw={(g) => {
                g.clear();
                g.lineStyle(1, 0xff0000);
                g.moveTo(firstPoint.x, base); // Adjust starting point based on offset
                g.lineTo(endOfChart, base);
              }}
            />

            <Graphics
              draw={(g) => {
                g.clear();
                g.beginFill(0xffffff);
                g.drawCircle(currentCoordinates.x, currentCoordinates.y, 3);
                g.endFill();
              }}
            />
            <Text
              ref={textRef}
              tint={0xffffff}
              text={displayScore}
              x={Math.max(
                getPointCoordinates(
                  points[points.length - 1],
                  points.length,
                  canvasHeight
                ).x - (textRef.current?.width || 0),
                0
              )}
              y={
                currentCoordinates.y -
                (textRef.current ? textRef.current.height : 0)
              }
              style={textStyle}
            />
          </Container>
        </Stage>
      </div>
      <Controls onClick={handleCtaClick} points={earning} status={gameStatus} />
      {gameStatus === GameStatus.ended && (
        <Score
          points={earning}
          currency="YCN"
          onClick={() => onStop(earning)}
        />
      )}
    </div>
  );
};

export default Game;
