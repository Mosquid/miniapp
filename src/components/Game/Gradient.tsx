"use client";

import { useMemo } from "react";
import * as PIXI from "pixi.js";

const colors = ["#56f7c874", "#000000"];

export function useBackgroundGradient(width: number, height: number) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    const grad = ctx.createLinearGradient(0, 0, 0, height);

    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.3, colors[1]);
    grad.addColorStop(0.6, colors[1]);
    grad.addColorStop(1, colors[0]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    return new PIXI.Texture(new PIXI.BaseTexture(canvas));
  }, [width, height]);

  return texture;
}
