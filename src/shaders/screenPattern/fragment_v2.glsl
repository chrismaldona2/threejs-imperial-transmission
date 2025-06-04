uniform float uTime;

void main() {
  gl_FragColor = vec4(0.003, 0.003, 0.003, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}