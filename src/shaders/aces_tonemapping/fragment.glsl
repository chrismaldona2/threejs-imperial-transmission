uniform sampler2D tDiffuse;
uniform float exposure;
varying vec2 vUv;

#include ../partials/color_conversion.glsl

vec3 RRTAndODTFit(vec3 v) {
  vec3 a = v * (v + 0.0245786) - 0.000090537;
  vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
  return a / b;
}

vec3 ACESFilmicToneMapping(vec3 color) {
  const mat3 ACESInputMat = mat3(
    vec3(0.59719, 0.07600, 0.02840),
    vec3(0.35458, 0.90834, 0.13383),
    vec3(0.04823, 0.01566, 0.83777)
  );

  const mat3 ACESOutputMat = mat3(
    vec3(1.60475, -0.10208, -0.00327),
    vec3(-0.53108, 1.10813, -0.07276),
    vec3(-0.07367, -0.00605, 1.07602)
  );

  color *= exposure / 0.6;
  color = ACESInputMat * color;
  color = RRTAndODTFit(color);
  color = ACESOutputMat * color;

  return clamp(color, 0.0, 1.0);
}

void main() {
  vec4 texel = texture2D(tDiffuse, vUv);
  texel.rgb = ACESFilmicToneMapping(texel.rgb);
  texel.rgb = linearToSRGB(texel.rgb);
  gl_FragColor = texel;
}