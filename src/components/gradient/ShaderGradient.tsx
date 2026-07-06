"use client"
import { ShaderGradientCanvas, ShaderGradient } from '@shadergradient/react'

function ShaderBackground() {
  return (
    <ShaderGradientCanvas
      style={{ position: 'absolute', inset: 0, zIndex: -1 }}
      pixelDensity={1.5}
      fov={45}
    >
      <ShaderGradient
        animate="on"
        brightness={0.9}
        cAzimuthAngle={380}
        cDistance={3}
        cPolarAngle={110}
        cameraZoom={1}
        color1="#0f0f0e"
        color2="#d52518"
        color3="#f3e8cc"
        envPreset="city"
        grain="off"
        lightType="3d"
        positionX={-0.2}
        positionY={0}
        positionZ={0}
        range="enabled"
        rangeEnd={40}
        rangeStart={0}
        reflection={0.5}
        rotationX={-150}
        rotationY={-20}
        rotationZ={50}
        shader="defaults"
        type="plane"
        uAmplitude={1}
        uDensity={0.1}
        uFrequency={5.5}
        uSpeed={0.15}
        uStrength={4.7}
        uTime={0}
        wireframe={false}
      />
    </ShaderGradientCanvas>
  )
}

export default ShaderBackground