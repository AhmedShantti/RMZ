"use client";

import { useEffect, useRef } from "react";
import { NeatGradient, type NeatConfig } from "@firecms/neat";

const config = {
  colors: [
    { color: "#D52518", enabled: true },
    { color: "#F3E8CC", enabled: true },
    { color: "#0F0F0E", enabled: true },
    { color: "#FF493B", enabled: false },
    { color: "#f5e1e5", enabled: false },
    { color: "#B2C7C2", enabled: false },
  ],
  speed: 2,
  horizontalPressure: 2,
  verticalPressure: 5,
  waveFrequencyX: 2,
  waveFrequencyY: 2,
  waveAmplitude: 5,
  shadows: 10,
  highlights: 8,
  colorBrightness: 1,
  colorSaturation: 10,
  wireframe: true,
  colorBlending: 6,
  backgroundColor: "#0F0F0E",
  backgroundAlpha: 1,
  grainScale: 0,
  grainSparsity: 0,
  grainIntensity: 0,
  grainSpeed: 0,
  resolution: 0.6,
  yOffset: 0,
  yOffsetWaveMultiplier: 6.4,
  yOffsetColorMultiplier: 3.5,
  yOffsetFlowMultiplier: 3.5,
  flowDistortionA: 0.4,
  flowDistortionB: 3,
  flowScale: 3.3,
  flowEase: 0.53,
  flowEnabled: false,
  enableProceduralTexture: false,
  transparentTextureVoid: false,
  textureVoidLikelihood: 0.06,
  textureVoidWidthMin: 10,
  textureVoidWidthMax: 500,
  textureBandDensity: 0.8,
  textureColorBlending: 0.06,
  textureSeed: 333,
  textureEase: 0.6,
  proceduralBackgroundColor: "#003FFF",
  textureShapeTriangles: 20,
  textureShapeCircles: 15,
  textureShapeBars: 15,
  textureShapeSquiggles: 10,
  domainWarpEnabled: false,
  domainWarpIntensity: 0,
  domainWarpScale: 3,
  vignetteIntensity: 0,
  vignetteRadius: 0.8,
  fresnelEnabled: false,
  fresnelPower: 2,
  fresnelIntensity: 0.5,
  fresnelColor: "#FFFFFF",
  iridescenceEnabled: false,
  iridescenceIntensity: 0.5,
  iridescenceSpeed: 1,
  bloomIntensity: 0,
  bloomThreshold: 0.7,
  chromaticAberration: 0,
  shapeType: "plane",
  shapeRotationX: 0,
  shapeRotationY: 0,
  shapeRotationZ: 0,
  shapeAutoRotateSpeedX: 0,
  shapeAutoRotateSpeedY: 0,
  sphereRadius: 15,
  torusRadius: 15,
  torusTube: 5,
  cylinderRadius: 10,
  cylinderHeight: 40,
  planeBend: 0,
  planeTwist: 0,
  silhouetteFade: 0.25,
  cylinderFade: 0.08,
  ribbonFade: 0.05,
  flatShading: true,
  cameraLock: true,
  cameraX: 0,
  cameraY: 0,
  cameraZ: 0,
  cameraRotationX: 0,
  cameraRotationY: 0,
  cameraRotationZ: 0,
  cameraZoom: 1,
} satisfies Omit<NeatConfig, "ref">;

export function NeatGradientBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<NeatGradient | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const isMobile = window.innerWidth < 768;

    const gradient = new NeatGradient({
      ref: canvas,
      ...config,
      resolution: isMobile ? 0.35 : config.resolution,
      shadows: isMobile ? 3 : config.shadows,
      highlights: isMobile ? 2 : config.highlights,
    });

    gradientRef.current = gradient;

    // Size the canvas from its own wrapper's real box, never from vw/vh.
    // This is what avoids the 100vw scrollbar-overflow bug and the
    // 100vh "address bar" bug on mobile in one shot.
    const resize = () => {
      const rect = wrapper.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 1);

      const width = rect.width;
      const height = rect.height;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      (gradientRef.current as any)?.resize?.();
      (gradientRef.current as any)?.update?.();
    };

    resize();

    // ResizeObserver reacts to the wrapper's actual rendered size,
    // which changes correctly when mobile browser chrome shows/hides —
    // window "resize" alone doesn't reliably fire for that.
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrapper);

    // Still listen for viewport resize (rotation, zoom, etc.) as a fallback.
    window.addEventListener("resize", resize);
    window.visualViewport?.addEventListener("resize", resize);

    const handleScroll = () => {
      if (gradientRef.current) {
        gradientRef.current.yOffset = window.scrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
      window.visualViewport?.removeEventListener("resize", resize);
      window.removeEventListener("scroll", handleScroll);

      gradient.destroy?.();
      gradientRef.current = null;
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 -z-10"
      style={{ pointerEvents: "none" }}
    >
      <canvas ref={canvasRef} id="gradient" className="block h-full w-full" />
    </div>
  );
}