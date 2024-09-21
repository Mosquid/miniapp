"use client";

// src/Game.tsx
import { useState, useRef, FC, useEffect } from "react";
import { Stage, Container, Graphics, Text } from "@pixi/react";
import { TextStyle } from "pixi.js";
import { random } from "lodash";

export interface GameProps {
  onStop: (points: number) => void;
}

const Game: FC<GameProps> = ({ onStop }) => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const [isRunning, setIsRunning] = useState(true);
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([
    { x: 100, y: windowHeight / 2 },
  ]);
  const maxPoints = 120;
  const [earnings, setEarnings] = useState(0);
  const textStyle = new TextStyle({
    fill: "white",
  });

  // Reference for animation frame
  const animationRef = useRef<NodeJS.Timeout>();

  // Canvas dimensions
  const canvasWidth = windowWidth;
  const canvasHeight = windowHeight;
  const base = canvasHeight / 2;

  // Function to start the game loop
  const startGame = () => {
    const addPoint = async () => {
      setPoints((prevPoints) => {
        const lastPoint = prevPoints[prevPoints.length - 1];
        const lastIndex = prevPoints.length - 1;

        const newX = lastPoint.x + 5; // Move right
        const newY = lastPoint.y * random(0.9, 1.1);
        // console.log({ newY, lastPoint });
        // Keep y within bounds
        const boundedY = Math.max(0, Math.min(canvasHeight, newY));

        return [...prevPoints, { x: newX, y: boundedY }];
      });

      if (points.length >= maxPoints) {
        setIsRunning(false);
        onStop(points.length);
      }

      // Continue the loop
      if (isRunning) {
        animationRef.current = setTimeout(addPoint, 50);
        // animationRef.current = requestAnimationFrame(addPoint);
      }
    };

    animationRef.current = setTimeout(addPoint, 0);
  };

  // Start the game loop when the component mounts
  useEffect(() => {
    if (isRunning) {
      startGame();
    }

    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isRunning]);

  // Function to handle quitting the game
  const quitGame = () => {
    setIsRunning(false);

    setEarnings(Math.round(earning));
  };

  // Calculate the offset to make the camera follow the last point
  const lastPoint = points[points.length - 1];
  const offsetX = Math.min(0, canvasWidth * 0.9 - lastPoint.x);
  const earning = base - lastPoint.y;

  useEffect(() => {
    if (isRunning && points.length >= maxPoints) {
      quitGame();
    }
  }, [points.length]);

  const lineColor = earning < 0 ? 0xff0000 : 0x00ff00;

  return (
    <div
      onClick={isRunning ? quitGame : undefined}
      style={{
        cursor: "pointer",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
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
              g.moveTo(points[0].x, points[0].y);
              points.forEach((point) => {
                g.lineTo(point.x, point.y);
              });
            }}
          />
          {/* Draw X-axis */}
          <Graphics
            draw={(g) => {
              g.lineStyle(1, 0xffffff);
              g.moveTo(points[0].x, base); // Adjust starting point based on offset
              g.lineTo(points[points.length - 1].x, base);
            }}
          />
          <Text
            tint={0xffffff}
            text={String(earning)}
            x={points[points.length - 1].x}
            y={base}
            style={textStyle}
          />
        </Container>
      </Stage>
      {!isRunning && (
        <div
          style={{
            textAlign: "center",
            marginTop: 20,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: 100,
          }}
        >
          <h2>You Quit the Game!</h2>
          <p>Your Earnings: ${earnings}</p>
          <button onClick={() => window.location.reload()}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default Game;
