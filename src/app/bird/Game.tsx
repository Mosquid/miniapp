"use client";

import React, { useState, useEffect, useRef } from "react";
import { Stage, Container, Graphics } from "@pixi/react";
import * as PIXI from "pixi.js";
import Button from "@/components/Button";

export interface GameProps {
  size: {
    width: number;
    height: number;
  };
}

const Game: React.FC<GameProps> = ({ size }) => {
  const { width, height } = size;
  const gravity = 0.5;
  const impulse = -10;
  const speed = 2;

  const [generated, setGenerated] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: height / 2 });
  const [velocity, setVelocity] = useState(0);
  const [terrainOffset, setTerrainOffset] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const terrainPointsTop = useRef<Array<{ x: number; y: number }>>([]);
  const terrainPointsBottom = useRef<Array<{ x: number; y: number }>>([]);

  const handleTap = () => {
    if (isGameOver) {
      return;
    }
    setVelocity(impulse);
  };

  const handleRestart = () => {
    resetGame();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isGameOver) {
        setVelocity(impulse);
      }
      if (e.key === "r" && isGameOver) {
        resetGame();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    generateTerrain();
    return () => window.removeEventListener("keydown", handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameOver]);

  useEffect(() => {
    if (isGameOver) return;
    const gameLoop = setInterval(() => {
      setVelocity((v) => v + gravity);
      setPosition((pos) => ({ x: pos.x, y: pos.y + velocity }));
      setTerrainOffset((offset) => offset + speed);
      setScore((s) => s + speed / 5);

      if (checkCollision()) {
        setIsGameOver(true);
      }
    }, 16);
    return () => clearInterval(gameLoop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [velocity, isGameOver]);

  const resetGame = () => {
    setPosition({ x: 100, y: height / 2 });
    setVelocity(0);
    setTerrainOffset(0);
    setScore(0);
    setIsGameOver(false);
    generateTerrain();
  };

  const generateTerrain = () => {
    const pointsTop: Array<{ x: number; y: number }> = [];
    const pointsBottom: Array<{ x: number; y: number }> = [];
    const amplitude = 75;
    const wavelength = 200;
    for (let x = 0; x < width * 2; x += 50) {
      const yTop =
        amplitude * Math.sin((x + Math.random() * 1000) / wavelength) + 100;
      const yBottom =
        height -
        amplitude * Math.cos((x + Math.random() * 1000) / wavelength) -
        100;
      pointsTop.push({ x, y: yTop });
      pointsBottom.push({ x, y: yBottom });
    }
    terrainPointsTop.current = pointsTop;
    terrainPointsBottom.current = pointsBottom;
    setGenerated(true);
  };

  const checkCollision = (): boolean => {
    const x = position.x + terrainOffset;
    const y = position.y;

    const getTerrainY = (
      points: Array<{ x: number; y: number }>
    ): number | null => {
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        if (x >= p1.x && x <= p2.x) {
          const t = (x - p1.x) / (p2.x - p1.x);
          return p1.y + t * (p2.y - p1.y);
        }
      }
      return null;
    };

    const terrainYTop = getTerrainY(terrainPointsTop.current);
    const terrainYBottom = getTerrainY(terrainPointsBottom.current);

    if (
      terrainYTop !== null &&
      terrainYBottom !== null &&
      (y - 10 < terrainYTop || y + 10 > terrainYBottom)
    ) {
      return true;
    }
    if (y - 10 < 0 || y + 10 > height) {
      return true;
    }
    if (terrainOffset > width) {
      setScore(Math.floor(score));
      setIsGameOver(true);
    }
    return false;
  };

  const drawTerrain = (
    g: PIXI.Graphics,
    points: Array<{ x: number; y: number }>
  ) => {
    g.clear();
    g.lineStyle(2, 0xffffff, 0.45);
    g.moveTo(-terrainOffset, points[0].y);
    points
      .filter((point) => !!point)
      .forEach((point) => {
        g.lineTo(point.x - terrainOffset, point.y);
      });
  };

  const drawPlayer = (g: PIXI.Graphics) => {
    g.clear();
    g.beginFill(0xc5ff00);
    g.drawCircle(position.x, position.y, 10);
    g.endFill();
  };

  return (
    <div>
      {generated && (
        <Stage
          width={width}
          height={height}
          options={{ backgroundColor: 0x232323 }}
          onClick={handleTap}
        >
          <Container pointertap={handleTap} interactive={true}>
            <Graphics
              draw={(g) =>
                drawTerrain(g, terrainPointsTop.current.filter(Boolean))
              }
            />
            <Graphics
              draw={(g) =>
                drawTerrain(g, terrainPointsBottom.current.filter(Boolean))
              }
            />
            <Graphics draw={drawPlayer} />
          </Container>
        </Stage>
      )}
      <div
        style={{
          position: "absolute",
          top: 10,
          left: 10,
          pointerEvents: "none",
        }}
      >
        Score: {Math.floor(score)}
      </div>
      {isGameOver && (
        <div
          style={{
            borderRadius: 10,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            position: "absolute",
            top: height / 2 - 50,
            left: width / 2 - 100,
            padding: 20,
            border: "1px solid #000",
            textAlign: "center",
          }}
        >
          <h2>Game Over</h2>
          <p style={{ marginBottom: 10 }}>Your Score: {Math.floor(score)}</p>
          <Button onClick={handleRestart}>Restart</Button>
        </div>
      )}
    </div>
  );
};

export default Game;
