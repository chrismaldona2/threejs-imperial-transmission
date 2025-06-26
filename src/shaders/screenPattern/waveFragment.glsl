varying vec2 vUv;

uniform vec3 uBackgroundColor;
uniform vec3 uGridColor;
uniform vec3 uWaveColor;

uniform vec2 uGridDisplacement;

uniform float uGridIntensity;
uniform float uGridColumns;
uniform float uGridRows;
uniform float uGridLinesThickness;

uniform float uTime;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uWaveThickness;
uniform float uWaveSpeed;

uniform float uSweepSpeed;
uniform float uSweepFrequency;
uniform float uSweepThickness;
uniform vec3 uSweepColor;


#include ../partials/scannerBar.glsl

void main() {
  vec2 gridUv = vUv + uGridDisplacement;
  gridUv.x += uTime * 0.01;
  float horizontalLines = smoothstep(1.0 - uGridLinesThickness, 1.0, mod(gridUv.x * uGridColumns, 1.0));
  horizontalLines *= smoothstep(1.0, uGridLinesThickness, horizontalLines);
  float verticalLines = smoothstep(1.0 - uGridLinesThickness, 1.0, mod(gridUv.y * uGridRows, 1.0));
  verticalLines *= smoothstep(1.0, uGridLinesThickness, verticalLines);
  float grid = clamp((verticalLines + horizontalLines) * uGridIntensity, 0.0, 1.0);

  float waveY = 0.5 + sin((vUv.x + uTime * uWaveSpeed) * uWaveFrequency) * uWaveAmplitude;
  float distToWave = abs(vUv.y - waveY);
  float waveStrength = 1.0 - smoothstep(0.0, uWaveThickness, distToWave);

  vec3 baseColor = mix(uBackgroundColor, uGridColor, grid);
  vec3 finalColor = mix(baseColor, uWaveColor, waveStrength);

  vec3 sweep = scannerBar(vUv, uTime, uSweepFrequency, uSweepSpeed, uSweepThickness, uSweepColor);
  finalColor += sweep;

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}
