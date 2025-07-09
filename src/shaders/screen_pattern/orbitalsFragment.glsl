varying vec2 vUv;

uniform float uTime; 
uniform vec3 uBackgroundColor;

uniform vec3 uGridColor;
uniform vec2 uGridDisplacement;
uniform float uGridIntensity;
uniform float uGridColumns;
uniform float uGridRows;
uniform float uGridLinesThickness;

uniform vec3 uRingColor;
uniform float uRingThickness;
uniform float uRingAspectScale;
uniform int uRingCount; // Number of rings
uniform vec3 uRings[5]; // Array of vec3: (x, y) = position, z = radius

uniform int uTargetCount;
uniform vec3 uTargetColor;
uniform vec2 uTargetPositions[5];
uniform float uTargetAspectScale;
uniform float uTargetRadius;
uniform float uTargetBlinkSpeed;
uniform float uMinTargetRadiusPercentage;

uniform float uLineAnimationSpeed;
uniform float uLinesAspectScale;
uniform float uLinesThickness;

void main() {
  vec2 gridUv = vUv + uGridDisplacement;
  float horizontalLines = smoothstep(1.0 - uGridLinesThickness, 1.0, mod(gridUv.x * uGridColumns, 1.0));
  horizontalLines *= smoothstep(1.0, uGridLinesThickness, horizontalLines);
  float verticalLines = smoothstep(1.0 - uGridLinesThickness, 1.0, mod(gridUv.y * uGridRows, 1.0));
  verticalLines *= smoothstep(1.0, uGridLinesThickness, verticalLines);
  float grid = clamp((verticalLines + horizontalLines) * uGridIntensity, 0.0, 1.0);

  float rings = 0.0;
  if (uRingCount > 0) {
    for (int i = 0; i < uRingCount; i++) {
      vec2 ringPos = uRings[i].xy; // Extract position (x, y)
      float ringRadius = uRings[i].z; // Extract radius (z)
      vec2 adjustedUv = vUv;
      adjustedUv.x *= uRingAspectScale;
      ringPos.x *= uRingAspectScale;
      float ringDist = length(adjustedUv - ringPos);
      float ring = abs(ringDist - ringRadius);
      ring = smoothstep(uRingThickness, 0.0, ring);
      rings += ring;
    }
  }

  vec2 adjustedUv = vUv - 0.5;
  adjustedUv.x *= uLinesAspectScale;
  adjustedUv += 0.5;
  float hLineY = (adjustedUv.y - 0.5) + (sin(uTime) * uLineAnimationSpeed);
  float hCenterDist = length(hLineY);
  float hLine = smoothstep(uLinesThickness, 0.0, hCenterDist);
  
  float vCenterDist = abs(adjustedUv.x - 0.5);
  vCenterDist = length(vCenterDist);
  float vLine = smoothstep(uLinesThickness, 0.0, vCenterDist);

  float crosslines = vLine + hLine;

  vec3 baseColor = mix(uBackgroundColor, uGridColor, grid);
  vec3 finalColor = mix(baseColor, uRingColor, rings + crosslines);

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