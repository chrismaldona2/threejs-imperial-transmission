uniform float uTime;

void main() {
  gl_FragColor = vec4(0.002, 0.002, 0.002, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}