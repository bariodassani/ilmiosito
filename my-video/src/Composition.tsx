import {
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
  spring,
} from "remotion";
import React from "react";

const Sparkle: React.FC<{
  x: number;
  y: number;
  delay: number;
  size: number;
  frame: number;
  fps: number;
}> = ({ x, y, delay, size, frame, fps }) => {
  const lifespan = fps * 0.6;
  const localFrame = frame - delay;

  if (localFrame < 0 || localFrame > lifespan) return null;

  const opacity = interpolate(
    localFrame,
    [0, lifespan * 0.3, lifespan],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale = interpolate(
    localFrame,
    [0, lifespan * 0.3, lifespan],
    [0.2, 1.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const rotation = interpolate(localFrame, [0, lifespan], [0, 180]);

  return (
    <div
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        fontSize: size,
        color: "#FFD700",
        textShadow: "0 0 10px #FFD700, 0 0 20px #FFA500",
        pointerEvents: "none",
      }}
    >
      ✦
    </div>
  );
};

const sparkleData = [
  { x: 8, y: 35, delay: 0, size: 28 },
  { x: 88, y: 30, delay: 4, size: 32 },
  { x: 15, y: 55, delay: 8, size: 24 },
  { x: 82, y: 58, delay: 6, size: 26 },
  { x: 50, y: 28, delay: 2, size: 30 },
  { x: 30, y: 32, delay: 10, size: 22 },
  { x: 70, y: 34, delay: 5, size: 28 },
  { x: 20, y: 48, delay: 12, size: 20 },
  { x: 78, y: 45, delay: 3, size: 26 },
  { x: 42, y: 60, delay: 9, size: 24 },
  { x: 58, y: 25, delay: 7, size: 30 },
  { x: 10, y: 42, delay: 14, size: 22 },
  { x: 90, y: 50, delay: 11, size: 26 },
  { x: 35, y: 62, delay: 13, size: 20 },
  { x: 65, y: 30, delay: 1, size: 32 },
];

export const MyComposition = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 360 rotation
  const startFrame = Math.round(3 * fps);
  const durationFrames = Math.round(1.5 * fps);

  const rotation = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 360],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.ease),
    },
  );

  // Text animation — appears at second 1
  const textStartFrame = Math.round(1 * fps);
  const textScale = spring({
    frame: frame - textStartFrame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 0.8 },
  });

  const textOpacity = interpolate(
    frame,
    [textStartFrame, textStartFrame + 8],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Sparkle loop offset — sparkles repeat every cycle
  const sparkleCycle = fps * 1.2;
  const sparkleLocalFrame = (frame - textStartFrame) % sparkleCycle;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        perspective: 1000,
        overflow: "hidden",
      }}
    >
      <OffthreadVideo
        src={staticFile("video.mov")}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          objectFit: "cover",
          transform: `rotateY(${rotation}deg)`,
        }}
      />

      {frame >= textStartFrame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Sparkles */}
          {sparkleData.map((s, i) => (
            <Sparkle
              key={i}
              x={s.x}
              y={s.y}
              delay={s.delay}
              size={s.size}
              frame={sparkleLocalFrame}
              fps={fps}
            />
          ))}

          {/* Text */}
          <div
            style={{
              opacity: textOpacity,
              transform: `scale(${textScale})`,
              fontFamily: "Impact, Arial Black, sans-serif",
              fontSize: 72,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              textTransform: "uppercase",
              lineHeight: 1.1,
              textShadow:
                "0 0 20px rgba(255,215,0,0.8), 0 0 40px rgba(255,165,0,0.5), 3px 3px 6px rgba(0,0,0,0.8)",
              letterSpacing: 4,
              padding: "0 40px",
            }}
          >
            DARIO BASSANI
            <br />
            ECCOLO QUA
          </div>
        </div>
      )}
    </div>
  );
};
