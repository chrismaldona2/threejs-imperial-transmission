#define PI 3.1415926535897932384626433832795

varying vec2 vUv;

uniform vec3 uStripeColor;
uniform vec3 uBackgroundColor;
uniform vec2 uDisplacement;
uniform float uTime;
uniform float uIntensity;
uniform float uStripeThickness;
uniform float uHorizontalStripesAmount;
uniform float uVerticalStripesAmount;
uniform float uSweepSpeed;
uniform float uSweepFrequency;

uniform float uMeshAspectRatio;

uniform vec2 uTargetPositions[3];
uniform int uTargetCount;
uniform float uTargetRadius;
uniform vec3 uTargetColor;
uniform float uTargetBlinkSpeed;
uniform float uMinTargetRadiusPct;

float radarSweep(vec2 uv, float time) {
  float strength = abs(sin(vUv.x * uSweepFrequency + uTime * uSweepSpeed));
  strength = step(0.99999, strength);
  return strength;
}

void main() {
  vec2 displacedUv = vUv + uDisplacement;
  float strength = 0.0;
  
  float smoothStart = 1.0 - uStripeThickness;
  float smoothEnd = uStripeThickness;
  
  float horizontalLines = mod(displacedUv.x * uHorizontalStripesAmount, 1.0);
  horizontalLines = smoothstep(smoothStart, 1.0, horizontalLines);
  horizontalLines *= smoothstep(1.0, smoothEnd, horizontalLines);


  float verticalLines = mod(displacedUv.y * uVerticalStripesAmount, 1.0);
  verticalLines = smoothstep(smoothStart, 1.0, verticalLines);
  verticalLines *= smoothstep(1.0, smoothEnd, verticalLines);

  strength += verticalLines + horizontalLines;

  float sweep = radarSweep(displacedUv, uTime);
  strength += sweep;

  float targetStrength = 0.0;
  for (int i = 0; i < uTargetCount; i++) {
    vec2 targetPos = uTargetPositions[i];
    vec2 adjustedUv = vUv;
    adjustedUv.x *= uMeshAspectRatio;
    targetPos.x *= uMeshAspectRatio;

    float animatedRadius = uTargetRadius * (uMinTargetRadiusPct + (1.0 - uMinTargetRadiusPct) * sin(uTime * uTargetBlinkSpeed));

    float dist = distance(adjustedUv, targetPos);
    if (dist < animatedRadius) {
      targetStrength = max(targetStrength, 1.0 - smoothstep(0.0, animatedRadius, dist));
    }
  }
  strength = max(strength, targetStrength);

  strength *= uIntensity;
  strength = clamp(strength, 0.0, 1.0);

  vec3 finalColor = mix(uBackgroundColor, uStripeColor, strength);
  if (targetStrength > 0.0) {
    finalColor = mix(finalColor, uTargetColor, targetStrength);
  }

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}