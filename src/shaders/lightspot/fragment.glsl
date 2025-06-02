varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform sampler2D uNoiseTexture;
uniform float uTime;
uniform float uSpeed;
uniform float uMaxIntensity;
uniform float uFalloffScale;
uniform float uFalloffOffset;
uniform float uBaseAlpha;
uniform float uNoiseAlphaScale;
uniform float uColorOffset;
uniform vec3 uColorTop;
uniform vec3 uColorBottom;


void main() {
  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) normal *= -1.0;

  vec2 animatedUv = vec2(vUv.x + uTime * uSpeed, vUv.y);
  float noise = texture2D(uNoiseTexture, animatedUv).r;

  float intensity = 
      uMaxIntensity - 
      (uFalloffScale * vUv.y - uFalloffOffset) * 
      (uFalloffScale * vUv.y - uFalloffOffset);

  float alpha = intensity * (uBaseAlpha + uNoiseAlphaScale * noise);

  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = dot(viewDirection, normal) + 1.0;
  fresnel = pow(fresnel, 1.5);
  float falloff = smoothstep(0.6, 0.0, fresnel);

  vec3 baseColor = mix(uColorTop, uColorBottom, vUv.y - uColorOffset + 0.5);
  vec3 finalColor = baseColor * alpha * falloff;

  gl_FragColor = vec4(finalColor, alpha);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}