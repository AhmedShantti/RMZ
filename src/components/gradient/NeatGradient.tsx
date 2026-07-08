"use client";
import { NeatGradient } from "@firecms/neat";
import { useEffect, useRef } from "react";

const config = {
    colors: [
        {
            color: '#0F0F0E', // black — repeated to dominate
            enabled: true,
        },
        {
            color: '#0F0F0E', // black
            enabled: true,
        },
        {
            color: '#0F0F0E', // black
            enabled: true,
        },
        {
            color: '#D52518', // red — smaller accent
            enabled: true,
        },
        {
            color: '#F3E8CC', // beige — smaller accent
            enabled: true,
        },
    ],
    speed: 4,
    horizontalPressure: 2,   // lower = larger, calmer color zones (favors dominant color spreading)
    verticalPressure: 2,
    waveFrequencyX: 0,
    waveFrequencyY: 0,
    waveAmplitude: 0,
    shadows: 2,
    highlights: 3,
    colorBrightness: 0.6,
    colorSaturation: 3,
    wireframe: false,
    colorBlending: 6,        // slightly lower than your original 10, so black holds sharper, larger regions instead of bleeding evenly
    backgroundColor: '#0F0F0E',
    backgroundAlpha: 1,
    // ...rest of your config unchanged

    grainScale: 5,
    grainSparsity: 1,
    grainIntensity: 2,
    grainSpeed: 0,
    resolution: 0.5,
    yOffset: -42137,
    yOffsetWaveMultiplier: 1.5,
    yOffsetColorMultiplier: 1.8,
    yOffsetFlowMultiplier: 2,
    flowDistortionA: 5,
    flowDistortionB: 7.7,
    flowScale: 2.6,
    flowEase: 0.36,
    flowEnabled: false,
    enableProceduralTexture: false,
    transparentTextureVoid: false,
    textureVoidLikelihood: 0.22,
    textureVoidWidthMin: 120,
    textureVoidWidthMax: 150,
    textureBandDensity: 1.9,
    textureColorBlending: 0.12,
    textureSeed: 333,
    textureEase: 0.75,
    proceduralBackgroundColor: '#D0DBFB',
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
    fresnelColor: '#FFFFFF',
    iridescenceEnabled: false,
    iridescenceIntensity: 0.5,
    iridescenceSpeed: 1,
    bloomIntensity: 0,
    bloomThreshold: 0.7,
    chromaticAberration: 0,
    shapeType: 'plane' as const,
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
};

export default function Gradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const gradient = new NeatGradient({
      ref: canvasRef.current,
      ...config,
    });

    return () => gradient.destroy?.();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="gradient"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
}