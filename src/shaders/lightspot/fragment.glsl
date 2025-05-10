varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

uniform float uTime;
uniform vec3 uColor;
uniform sampler2D uNoiseTexture;  

void main() {
  vec3 normal = normalize(vNormal);

  gl_FragColor = vec4(normal, 1.0);
  
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}

