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

  strength *= uIntensity;
  strength = clamp(strength, 0.0, 1.0);

  vec3 finalColor = mix(uBackgroundColor, uStripeColor, strength);

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}