import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type HeroBackgroundSceneProps = {
  animate?: boolean;
  className?: string;
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uPointer;
uniform float uPointerForce;
uniform float uThemeMix;
uniform vec4 uRipples[3];

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.1 + vec2(19.1, 7.3);
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 p = uv - 0.5;
  float aspect = uResolution.x / uResolution.y;
  p.x *= aspect;

  vec2 pointer = (uPointer - 0.5) * vec2(aspect, 1.0);
  vec2 toPointer = p - pointer;
  float pointerDistance = length(toPointer);
  float pointerField = exp(-4.5 * pointerDistance);
  float pointerStrength = 0.035 + uPointerForce * 0.18;
  vec2 flowWarp = vec2(-toPointer.y, toPointer.x) * pointerField * pointerStrength;
  p += flowWarp * 0.32;

  // Ripple system — computed before waves so ripples disrupt the field
  float rippleWarp = 0.0;
  float rippleContour = 0.0;
  for (int i = 0; i < 3; i++) {
    vec4 ripple = uRipples[i];
    float age = uTime - ripple.z;
    if (ripple.w > 0.0 && age >= 0.0 && age < 3.4) {
      vec2 rc = (ripple.xy - 0.5) * vec2(aspect, 1.0);
      float dist = length(p - rc);
      float radius = age * 0.2;
      float fade = smoothstep(3.4, 0.3, age) * ripple.w;

      // Disrupt existing waves across the full ripple area
      float inArea = smoothstep(radius + 0.08, radius * 0.1, dist);
      rippleWarp += sin(dist * 22.0 - age * 6.5) * fade * inArea * 0.08;

      // Concentric contour rings matching the wave line style
      float rings = abs(sin((dist - age * 0.14) * 28.0));
      rings = pow(1.0 - rings, 15.0);
      float ringMask = smoothstep(radius + 0.03, radius - 0.02, dist)
                      * smoothstep(0.01, 0.05, dist);
      rippleContour += rings * fade * ringMask;
    }
  }

  float time = uTime * 0.18;
  vec2 flow = p * 2.6 + flowWarp * 1.8;

  float fieldA = fbm(flow + vec2(time * 0.55, -time * 0.25));
  float fieldB = fbm(flow * 1.45 - vec2(time * 0.25, time * 0.35));
  float blend = 0.5 * fieldA + 0.5 * fieldB + rippleWarp;

  float contour = abs(sin((p.y + blend * 0.28 - time * 0.12) * 28.0));
  contour = pow(1.0 - contour, 15.0);
  contour = clamp(contour + rippleContour, 0.0, 1.0);

  float ribbon = smoothstep(0.72, 0.06, abs(p.y + sin(p.x * 1.8 + time * 0.85) * 0.14));
  float ribbon2 = smoothstep(0.64, 0.04, abs(p.y - 0.22 + sin(p.x * 1.2 - time * 0.7) * 0.12));
  float haze = smoothstep(1.38, 0.16, length(p * vec2(0.95, 1.1)));
  float grain = noise(uv * uResolution * 0.42 + uTime * 0.025) - 0.5;
  float pointerGlow = pointerField * (0.08 + uPointerForce * 0.24);

  ribbon = clamp(ribbon + pointerField * 0.08, 0.0, 1.0);
  contour = clamp(contour + pointerGlow * 0.22, 0.0, 1.0);

  vec3 darkBase = vec3(0.032, 0.038, 0.058);
  vec3 lightBase = vec3(0.86, 0.85, 0.84);
  vec3 base = mix(darkBase, lightBase, uThemeMix);

  vec3 accentA = mix(vec3(0.46, 0.56, 0.92), vec3(0.38, 0.44, 0.68), uThemeMix);
  vec3 accentB = mix(vec3(0.87, 0.63, 0.42), vec3(0.72, 0.52, 0.38), uThemeMix);
  vec3 accentC = mix(vec3(0.70, 0.48, 0.80), vec3(0.52, 0.42, 0.62), uThemeMix);
  vec3 neutralLift = mix(vec3(0.18, 0.20, 0.26), vec3(0.36, 0.36, 0.38), uThemeMix);

  // Wave lines: additive glow in dark mode, subtractive grey in light mode
  vec3 ribbonTint  = mix(accentA * 0.16, vec3(-0.10, -0.10, -0.08), uThemeMix);
  vec3 contourTint = mix(accentC * 0.08, vec3(-0.13, -0.12, -0.11), uThemeMix);
  vec3 ribbon2Tint = mix(accentB * 0.05, vec3(-0.07, -0.07, -0.06), uThemeMix);

  vec3 color = base;
  color += ribbonTint * ribbon * haze;
  color += contourTint * contour * haze;
  color += ribbon2Tint * ribbon2 * haze;
  color += neutralLift * blend * mix(0.18, 0.14, uThemeMix);
  color += accentA * pointerGlow * mix(0.08, 0.06, uThemeMix);
  color += grain * mix(0.03, 0.022, uThemeMix);

  float vignette = smoothstep(1.42, 0.2, length(p * vec2(0.92, 1.06)));
  color *= mix(vignette, 1.0, uThemeMix * 0.92);

  gl_FragColor = vec4(color, mix(0.96, 0.94, uThemeMix));
}
`;

const HeroBackgroundScene: React.FC<HeroBackgroundSceneProps> = ({
  animate = true,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uPointerForce: { value: 0 },
      uThemeMix: { value: 0 },
      uRipples: {
        value: Array.from({ length: 3 }, () => new THREE.Vector4(-2, -2, -10, 0)),
      },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      uniforms,
    });

    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(mesh);

    const pointerTarget = new THREE.Vector2(0.5, 0.5);
    const previousPointer = new THREE.Vector2(0.5, 0.5);
    let targetPointerForce = 0;
    let frameId = 0;

    const syncTheme = () => {
      uniforms.uThemeMix.value = document.documentElement.dataset.theme === 'light' ? 1 : 0;
    };

    const setSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      renderer.setSize(parent.clientWidth, parent.clientHeight, false);
      uniforms.uResolution.value.set(parent.clientWidth, parent.clientHeight);
    };

    const getPointerInBounds = (event: PointerEvent) => {
      const parent = canvas.parentElement;
      if (!parent) return null;

      const rect = parent.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      if (x < 0 || x > 1 || y < 0 || y > 1) return null;

      // Flip y: screen y=0 is top, but WebGL UV y=0 is bottom
      return { x, y: 1 - y };
    };

    const pushRipple = (x: number, y: number, strength: number) => {
      const ripples = uniforms.uRipples.value as THREE.Vector4[];
      ripples.pop();
      ripples.unshift(new THREE.Vector4(x, y, uniforms.uTime.value, strength));
    };

    const handlePointerMove = (event: PointerEvent) => {
      const point = getPointerInBounds(event);
      if (!point) return;

      pointerTarget.set(point.x, point.y);
      const movement = previousPointer.distanceTo(pointerTarget);
      targetPointerForce = Math.min(1, Math.max(targetPointerForce, movement * 9));
      previousPointer.copy(pointerTarget);
    };

    const handlePointerLeave = () => {
      pointerTarget.set(0.5, 0.5);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const point = getPointerInBounds(event);
      if (!point) return;

      pointerTarget.set(point.x, point.y);
      previousPointer.copy(pointerTarget);
      targetPointerForce = 1;
      pushRipple(point.x, point.y, event.pointerType === 'touch' ? 1.0 : 0.8);
    };

    const renderFrame = (time: number) => {
      uniforms.uTime.value = time * 0.001;
      uniforms.uPointer.value.lerp(pointerTarget, 0.05);
      uniforms.uPointerForce.value += (targetPointerForce - uniforms.uPointerForce.value) * 0.09;
      targetPointerForce *= 0.92;
      renderer.render(scene, camera);
    };

    setSize();
    syncTheme();

    const themeObserver = new MutationObserver(syncTheme);
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    if (animate) {
      const tick = (time: number) => {
        renderFrame(time);
        frameId = window.requestAnimationFrame(tick);
      };
      frameId = window.requestAnimationFrame(tick);
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointerdown', handlePointerDown, { passive: true });
      window.addEventListener('pointerleave', handlePointerLeave, { passive: true });
    } else {
      renderFrame(0);
    }

    window.addEventListener('resize', setSize);

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.cancelAnimationFrame(frameId);
      themeObserver.disconnect();

      mesh.geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [animate]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};

export default HeroBackgroundScene;
