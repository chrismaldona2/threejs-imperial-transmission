varying vec2 vUv;

uniform float uTime; 
uniform vec3 uBackgroundColor;
uniform vec3 uGridColor;
uniform vec2 uGridDisplacement;
uniform float uIntensity;
uniform float uGridColumns;
uniform float uGridRows;
uniform float uGridLineThickness;
uniform vec3 uRingColor;
uniform float uRingThickness;
uniform float uRingAspectScale;

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
  strength *= uIntensity;
  strength = clamp(strength, 0.0, 1.0);

  vec3 gridColor = mix(uBackgroundColor, uGridColor, strength);

  vec2 ring1Uv = vUv - 0.5;
  ring1Uv.x *= uRingAspectScale;
  float dist1 = length(ring1Uv);

  float ringStrength = 0.0;
  float radius = 0.48;
  float ring = abs(dist1 - radius);
  ring = smoothstep(uRingThickness, 0.0, ring);
  ringStrength = max(ringStrength, ring);

  vec2 ring2Uv = vUv - 0.5;
  ring2Uv.x += 0.25;
  ring2Uv.x *= uRingAspectScale;

  float dist2 = length(ring2Uv);

  float secondRingStrength = 0.0;
  float secondRadius = 0.2;
  float secondRing = abs(dist2 - secondRadius);
  secondRing = smoothstep(uRingThickness, 0.0, secondRing);

  ringStrength = max(ringStrength, secondRing);

  float vCenterDist = abs(vUv.y - 0.5);
  vCenterDist = length(vCenterDist);
  float vLine = smoothstep(0.0125, 0.0, vCenterDist);

  float hCenterDist = abs(vUv.x - 0.5);
  hCenterDist = length(hCenterDist);
  float hLine = smoothstep(0.01, 0.0, hCenterDist);

  ringStrength += vLine + hLine;

  vec3 finalColor = mix(gridColor, uRingColor, ringStrength);

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}