varying vec2 vUv;

uniform vec3 uGridColor;
uniform vec3 uBackgroundColor;
uniform vec2 uGridDisplacement;
uniform float uTime;
uniform float uGridIntensity;
uniform float uGridLinesThickness;
uniform float uGridColumns;
uniform float uGridRows;
uniform float uSweepSpeed;
uniform float uSweepFrequency;
uniform float uSweepThickness;
uniform vec3 uSweepColor;

uniform vec2 uTargetPositions[10];
uniform int uTargetCount;
uniform float uTargetRadius;
uniform vec3 uTargetColor;
uniform float uTargetBlinkSpeed;
uniform float uMinTargetRadiusPercentage;
uniform float uTargetAspectScale;

#include ../partials/scanner_bar.glsl

void main() {
  vec2 gridUv = vUv + uGridDisplacement;
  float horizontalLines = smoothstep(1.0 - uGridLinesThickness, 1.0, mod(gridUv.x * uGridColumns, 1.0));
  horizontalLines *= smoothstep(1.0, uGridLinesThickness, horizontalLines);
  float verticalLines = smoothstep(1.0 - uGridLinesThickness, 1.0, mod(gridUv.y * uGridRows, 1.0));
  verticalLines *= smoothstep(1.0, uGridLinesThickness, verticalLines);
  float grid = clamp((verticalLines + horizontalLines) * uGridIntensity, 0.0, 1.0);

  vec3 sweep = scannerBar(vUv, uTime, uSweepFrequency, uSweepSpeed, uSweepThickness, uSweepColor);
  
  vec3 baseColor = mix(uBackgroundColor, uGridColor, grid);
  vec3 finalColor = baseColor + sweep;

  if (uTargetCount > 0) {
    float targetStrength = 0.0;
    for (int i = 0; i < uTargetCount; i++) {
      vec2 targetPos = uTargetPositions[i];
      vec2 adjustedUv = vUv;
      adjustedUv.x *= uTargetAspectScale;
      targetPos.x *= uTargetAspectScale;

      float animatedRadius = uTargetRadius * (uMinTargetRadiusPercentage + (1.0 - uMinTargetRadiusPercentage) * sin(uTime * uTargetBlinkSpeed));

      float dist = distance(adjustedUv, targetPos);
      if (dist < animatedRadius) {
        targetStrength = max(targetStrength, 1.0 - smoothstep(0.0, animatedRadius, dist));
      }
    }
    finalColor = mix(finalColor, uTargetColor, targetStrength);
  }

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}