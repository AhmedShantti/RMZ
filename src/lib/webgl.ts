/**
 * True when WebGL is running on a SOFTWARE rasteriser (SwiftShader / llvmpipe /
 * Microsoft Basic Render / no GPU). There the per-frame shader costs ~1s+ on the
 * main thread — this is exactly what Lighthouse's headless Chrome uses, and some
 * low-end devices. When can't-tell, assume hardware (don't over-degrade).
 *
 * Leaf utility: DOM-only, depends on nothing else in the app.
 */
export function isSoftwareWebGL(): boolean {
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
