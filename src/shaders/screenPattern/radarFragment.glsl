varying vec2 vUv;

uniform vec3 uGridColor;
uniform vec3 uBackgroundColor;
uniform vec2 uGridDisplacement;
uniform float uTime;
uniform float uIntensity;
uniform float uGridLineThickness;
uniform float uGridColumns;
uniform float uGridRows;
uniform float uSweepSpeed;
uniform float uSweepFrequency;
uniform float uSweepThickness;
uniform vec3 uSweepColor;

uniform float uAspectScale;

uniform vec2 uTargetPositions[10];
uniform int uTargetCount;
uniform float uTargetRadius;
uniform vec3 uTargetColor;
uniform float uTargetBlinkSpeed;
uniform float uMinTargetRadiusPercentage;

#include ../partials/scannerBar.glsl

void main() {
  vec2 displacedUv = vUv + uGridDisplacement;
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

  float targetStrength = 0.0;
  for (int i = 0; i < uTargetCount; i++) {
    vec2 targetPos = uTargetPositions[i];
    vec2 adjustedUv = vUv;
    adjustedUv.x *= uAspectScale;
    targetPos.x *= uAspectScale;

    float animatedRadius = uTargetRadius * (uMinTargetRadiusPercentage + (1.0 - uMinTargetRadiusPercentage) * sin(uTime * uTargetBlinkSpeed));

    float dist = distance(adjustedUv, targetPos);
    if (dist < animatedRadius) {
      targetStrength = max(targetStrength, 1.0 - smoothstep(0.0, animatedRadius, dist));
    }
  }
  strength = max(strength, targetStrength);

  strength *= uIntensity;
  strength = clamp(strength, 0.0, 1.0);

  vec3 finalColor = mix(uBackgroundColor, uGridColor, strength);

  vec3 sweep = scannerBar(vUv, uTime, uSweepFrequency, uSweepSpeed, uSweepThickness, uSweepColor);
  finalColor += sweep;

  if (targetStrength > 0.0) {
    finalColor = mix(finalColor, uTargetColor, targetStrength);
  }

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}