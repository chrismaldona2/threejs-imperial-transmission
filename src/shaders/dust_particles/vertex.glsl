uniform float uDustSize;
uniform float uTime;
uniform float uDustMovementFrequency;
uniform float uDustMovementAmplitude;

void main() {
  vec3 pos = position;
  pos.x += sin(uTime + position.y * uDustMovementFrequency) * uDustMovementAmplitude;
  pos.y += sin(uTime + position.z * uDustMovementFrequency) * uDustMovementAmplitude;
  pos.z += sin(uTime + position.x * uDustMovementFrequency) * uDustMovementAmplitude;

  vec4 viewPosition = viewMatrix * modelMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uDustSize;
  gl_PointSize *= ( 1.0 / - viewPosition.z );
}