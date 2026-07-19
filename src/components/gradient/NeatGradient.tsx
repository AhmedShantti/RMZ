"use client";
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

/** Internal @firecms/neat fields we poke to freeze a single static frame.
 *  (Confirmed against the installed version; all access is guarded so a library
 *  change can't crash the page — it just falls back to the animated loop, which
 *  the library already pauses when the tab is hidden.) */
type NeatInternals = {
  requestRef?: number;
  _isVisible?: boolean;
  _visibilityObserver?: { disconnect: () => void } | null;
  _visibilityHandler?: (() => void) | null;
};

/**
 * True when WebGL is running on a SOFTWARE rasteriser (SwiftShader / llvmpipe /
 * Microsoft Basic Render / no GPU). There the per-frame shader costs ~1s+ on the
 * main thread — this is exactly what Lighthouse's headless Chrome uses, and some
 * low-end devices. When can't-tell, assume hardware (don't over-degrade).
 */
function isSoftwareWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    const gl = (c.getContext("webgl") ||
      c.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    if (!gl) return true; // no WebGL at all → treat as incapable
    const ext = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = ext
      ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || "")
      : "";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    if (!renderer) return false; // extension blocked → assume hardware
    return /swiftshader|software|llvmpipe|basic render|microsoft basic|apple software|softpipe/i.test(
      renderer,
    );
  } catch {
    return true;
  }
}

export default function Gradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Paint the gradient's own base colour on the fixed backdrop immediately, so
    // it's never a flash of pure black before (or if) the WebGL layer starts.
    // It's ~90% of the gradient anyway, so the deferred start below is invisible.
    canvas.style.background = config.backgroundColor;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Software / CPU WebGL (no-GPU devices, some Lighthouse runners): don't touch
    // WebGL at all. Each frame runs on the CPU main thread (seconds of blocking).
    // Best-effort — some environments mask the renderer string, so the deferral
    // below is the backstop that keeps even an undetected software path out of
    // the critical window.
    if (isSoftwareWebGL()) return; // base colour already painted

    let gradient: { destroy?: () => void } | null = null;
    let cancelled = false;
    let idleId: number | undefined;
    let timerId: number | undefined;

    const start = () => {
      if (cancelled || !canvasRef.current) return;
      // Lazy-load @firecms/neat (bundles three.js — the heaviest dependency) only
      // when we start, so it's out of the critical bundle.
      import("@firecms/neat").then(({ NeatGradient }) => {
        if (cancelled || !canvasRef.current) return;

        gradient = new NeatGradient({
          ref: canvas,
          ...config,
          // Retain the single rendered frame on the canvas when we freeze it.
          preserveDrawingBuffer: reduce,
        });

        if (reduce) {
          // Reduced-motion on a capable GPU: render one frame (cheap on a GPU),
          // then cancel the loop + disconnect the library's auto-resume observers
          // so it stays a single static frame with no ongoing per-frame work.
          const g = gradient as unknown as NeatInternals;
          let frozen = false;
          try {
            if (typeof g.requestRef === "number") {
              cancelAnimationFrame(g.requestRef);
              frozen = true;
            }
            g._isVisible = false;
            g._visibilityObserver?.disconnect();
            if (g._visibilityHandler) {
              document.removeEventListener(
                "visibilitychange",
                g._visibilityHandler,
              );
              g._visibilityHandler = null;
            }
          } catch {
            frozen = false;
          }
          // If the internals moved (e.g. a library bump renamed `requestRef`) the
          // loop is still running — degraded, not broken (still tab-guarded).
          // Surface it loudly in dev/staging so it can't ship silently.
          if (!frozen && process.env.NODE_ENV !== "production") {
            console.warn(
              "[NeatGradient] Could not freeze the static frame — @firecms/neat internal `requestRef` not found. The animation loop may still be running; check for a library version bump.",
            );
          }
        }
      });
    };

    // Defer initialisation until the page is interactive AND the main thread is
    // idle. Total Blocking Time is only measured up to interactive, so this keeps
    // the WebGL init + first frames (heavy under software rasterisation) out of
    // TBT and off the hero's critical path. Real users get the animation a beat
    // later, over the matching base colour, so there's no visible flash.
    const schedule = () => {
      if (cancelled) return;
      const ric = (
        window as unknown as {
          requestIdleCallback?: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback;
      if (ric) idleId = ric(start, { timeout: 2500 });
      else timerId = window.setTimeout(start, 1200);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener("load", schedule);
      const cic = (
        window as unknown as { cancelIdleCallback?: (id: number) => void }
      ).cancelIdleCallback;
      if (idleId !== undefined && cic) cic(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
      gradient?.destroy?.();
    };
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