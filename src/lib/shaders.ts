import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

export const PlanetMaterial = shaderMaterial(
  {
    uTime: 0,
    uPower: 0.5,
    uDayNight: 1.0,
  },
  // Vertex Shader
  `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vElevation;
  uniform float uTime;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }
  float noise(vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0 + 113.0*p.z;
    return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),
                   mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),
               mix(mix( hash(n+113.0), hash(n+114.0),f.x),
                   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
  }

  void main() {
    vUv = uv;
    vPosition = position;
    float elevation = noise(position * 2.0) * 0.5;
    elevation += noise(position * 4.0) * 0.25;
    vElevation = elevation;
    vec3 newPosition = position + normal * elevation;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
  `,
  // Fragment Shader
  `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying float vElevation;
  uniform float uTime;
  uniform float uDayNight;
  uniform float uPower;

  void main() {
    vec3 color;
    vec3 water = vec3(0.0, 0.2, 0.6);
    vec3 sand = vec3(0.8, 0.7, 0.5);
    vec3 grass = vec3(0.1, 0.5, 0.1);
    vec3 rock = vec3(0.4, 0.3, 0.2);
    vec3 snow = vec3(0.9, 0.9, 1.0);
    vec3 lava = vec3(1.0, 0.2, 0.0);

    if(vElevation < 0.1) {
      color = water;
    } else if(vElevation < 0.15) {
      color = sand;
    } else if(vElevation < 0.4) {
      color = grass;
    } else if(vElevation < 0.6) {
      color = rock;
    } else {
      color = snow;
    }

    float lavaNoise = sin(vPosition.x * 10.0) * cos(vPosition.z * 10.0);
    if(lavaNoise > 0.8 && vElevation > 0.3) {
      color = mix(color, lava, uPower);
    }

    color *= mix(0.2, 1.0, uDayNight);
    if(color.r > 0.9 && color.g < 0.3) { // Lava check
      color += vec3(1.0, 0.2, 0.0) * sin(uTime * 5.0) * 0.5;
    }

    gl_FragColor = vec4(color, 1.0);
  }
  `
);

export const AuroraMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#00ffcc'),
  },
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  void main() {
    float strength = sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
    strength *= sin(vUv.y * 5.0 - uTime * 0.5) * 0.5 + 0.5;
    strength *= (1.0 - vUv.y);
    gl_FragColor = vec4(uColor, strength * 0.5);
  }
  `
);

export const MonolithMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#4fd1c5'),
    uPower: 0.5,
    uDayNight: 1.0,
  },
  `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uPower;
  void main() {
    vUv = uv;
    vPosition = position;
    vec3 pos = position;
    float pulse = sin(uTime * 2.0) * 0.02 * uPower;
    pos += normal * pulse;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
  `,
  `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uDayNight;
  void main() {
    float runes = sin(vUv.y * 20.0 - uTime * 2.0) * 0.5 + 0.5;
    runes *= sin(vUv.x * 10.0 + uTime) * 0.5 + 0.5;
    float flow = sin(vPosition.y * 5.0 - uTime * 3.0) * 0.5 + 0.5;
    vec3 nightColor = vec3(0.1, 0.4, 0.8);
    vec3 dayColor = uColor;
    vec3 finalColor = mix(nightColor, dayColor, uDayNight);
    float intensity = (runes * 0.3 + flow * 0.7) * uPower;
    gl_FragColor = vec4(finalColor + intensity * finalColor * 2.0, 1.0);
  }
  `
);
