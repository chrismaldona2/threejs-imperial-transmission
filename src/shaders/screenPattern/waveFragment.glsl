varying vec2 vUv;

uniform vec3 uBackgroundColor;
uniform vec3 uGridColor;
uniform vec3 uWaveColor;

uniform vec2 uGridDisplacement;

uniform float uIntensity;
uniform float uGridColumns;
uniform float uGridRows;
uniform float uGridLineThickness;

uniform float uTime;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveThickness;

uniform float uSweepSpeed;
uniform float uSweepFrequency;
uniform float uSweepThickness;
uniform vec3 uSweepColor;

#include ../partials/scannerBar.glsl

void main() {
  vec2 displacedUv = vUv + uGridDisplacement;
  displacedUv.x += uTime * 0.01;
  float strength = 0.0;
  
  float smoothStart = 1.0 - uGridLineThickness;
  float smoothEnd = uGridLineThickness;
  
  float horizontalLines = mod(displacedUv.x * uGridColumns, 1.0);
  horizontalLines = smoothstep(smoothStart, 1.0, horizontalLines);
  horizontalLines *= smoothstep(1.0, smoothEnd, horizontalLines);

  float verticalLines = mod(displacedUv.y * uGridRows, 1.0);
  verticalLines = smoothstep(smoothStart, 1.0, verticalLines);
  verticalLines *= smoothstep(1.0, smoothEnd, verticalLines);

  strength += verticalLines + horizontalLines;
  strength *= uIntensity;
  strength = clamp(strength, 0.0, 1.0);

  float waveY = 0.5 + sin((vUv.x + uTime * 0.5) * uWaveFrequency) * uWaveAmplitude;
  float distToWave = abs(vUv.y - waveY);
  float waveStrength = 1.0 - smoothstep(0.0, uWaveThickness, distToWave);

  vec3 baseColor = mix(uBackgroundColor, uGridColor, strength);
  vec3 finalColor = mix(baseColor, uWaveColor, waveStrength);

  vec3 sweep = scannerBar(vUv, uTime, uSweepFrequency, uSweepSpeed, uSweepThickness, uSweepColor);
  finalColor += sweep;

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}
