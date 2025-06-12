varying vec2 vUv;

uniform float uTime;
uniform float uMeshAspectRatio;

void main() {
  vec2 uv = vUv;

  float outerCircle = distance(uv, vec2(0.5));
  outerCircle = 1.0 - step(0.3, outerCircle);

  float innerCircle = distance(uv, vec2(0.5));
  innerCircle = 1.0 - step(0.28, innerCircle);

  float strength = 1.0 - (outerCircle - innerCircle);

  vec3 color = vec3(1.0, 0.0, 0.0);
  vec3 bgColor = vec3(0.003);
  vec3 finalColor = mix(color, bgColor, strength);

  gl_FragColor = vec4(finalColor, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}