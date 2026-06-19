import { useEffect, useRef } from "react";
import type { MapItem, PlayerState } from "../types";

const CANVAS_WIDTH = 960;
const CANVAS_HEIGHT = 600;
const PLAYER_SIZE = 22;
const SPEED = 18;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function OfficeCanvas({
  map,
  players,
  self,
  onMove,
}: {
  map: MapItem;
  players: PlayerState[];
  self: PlayerState | null;
  onMove: (position: { x: number; y: number }) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backgroundRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const image = new Image();
    image.src = map.imageUrl;
    backgroundRef.current = image;
  }, [map.imageUrl]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!self) {
        return;
      }

      const nextPosition = { ...self.position };

      if (event.key === "ArrowUp" || event.key === "w") {
        nextPosition.y = clamp(self.position.y - SPEED, 0, CANVAS_HEIGHT - PLAYER_SIZE);
      } else if (event.key === "ArrowDown" || event.key === "s") {
        nextPosition.y = clamp(self.position.y + SPEED, 0, CANVAS_HEIGHT - PLAYER_SIZE);
      } else if (event.key === "ArrowLeft" || event.key === "a") {
        nextPosition.x = clamp(self.position.x - SPEED, 0, CANVAS_WIDTH - PLAYER_SIZE);
      } else if (event.key === "ArrowRight" || event.key === "d") {
        nextPosition.x = clamp(self.position.x + SPEED, 0, CANVAS_WIDTH - PLAYER_SIZE);
      } else {
        return;
      }

      onMove(nextPosition);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onMove, self]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let animationFrame = 0;

    const draw = () => {
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (backgroundRef.current?.complete) {
        context.drawImage(backgroundRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      } else {
        context.fillStyle = "#0f172a";
        context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      }

      context.fillStyle = "rgba(11, 18, 32, 0.28)";
      context.fillRect(0, CANVAS_HEIGHT - 48, CANVAS_WIDTH, 48);

      players.forEach((player) => {
        context.fillStyle = player.id === self?.id ? "#38bdf8" : "#f59e0b";
        context.strokeStyle = player.id === self?.id ? "#bae6fd" : "#fde68a";
        context.lineWidth = 2;
        context.beginPath();
        context.roundRect(
          player.position.x,
          player.position.y,
          PLAYER_SIZE,
          PLAYER_SIZE,
          7
        );
        context.fill();
        context.stroke();

        context.fillStyle = "#e2e8f0";
        context.font = '600 12px "Avenir Next", sans-serif';
        context.fillText(player.id, player.position.x - 2, player.position.y - 10);
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    draw();

    return () => window.cancelAnimationFrame(animationFrame);
  }, [players, self]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="office-canvas"
      aria-label={`Interactive office map for ${map.mapName}`}
    />
  );
}
