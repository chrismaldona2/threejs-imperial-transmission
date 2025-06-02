varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform float uGlitchIntensity;

#include ../partials/random2D.glsl

void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float glitchTime = (uTime - modelPosition.y) * 0.5;
  float glitchStrength = sin(glitchTime) + sin(glitchTime * 5.15) * sin(glitchTime * 8.7);
  glitchStrength /= 3.0;
  glitchStrength = smoothstep(0.3, 1.25, glitchStrength);
  glitchStrength *= uGlitchIntensity;

  modelPosition.x += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
  modelPosition.z += (random2D(modelPosition.xz + uTime) - 0.5) * glitchStrength;
  
  gl_Position = projectionMatrix * viewMatrix * modelPosition;

  vec4 modelNormal = modelMatrix * vec4(normal, 0.0);
  vPosition = modelPosition.xyz;
  vNormal = modelNormal.xyz;
}