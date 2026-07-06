"use client"

import { useEffect, useRef } from "react"
import { NeatGradient, type NeatConfig } from "@firecms/neat"

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
} satisfies Omit<NeatConfig, "ref">

export function NeatGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gradientRef = useRef<NeatGradient | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const gradient = new NeatGradient({
      ref: canvas,
      ...config,
    })
    gradientRef.current = gradient

    const setCanvasSize = () => {
      const dpr = Math.max(1, window.devicePixelRatio || 1)
      const { width, height } = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(width * dpr))
      const h = Math.max(1, Math.floor(height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }
    // Initial sizing
    setCanvasSize()
    const handleResize = () => setCanvasSize()
    window.addEventListener("resize", handleResize)

    const handleScroll = () => {
      if (gradientRef.current) {
        gradientRef.current.yOffset = window.scrollY
      }
    }
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
      gradient.destroy?.()
      gradientRef.current = null
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      id="gradient"
      className="fixed inset-0 -z-10 h-full w-full"
    />
  )
}