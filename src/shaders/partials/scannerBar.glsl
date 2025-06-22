
vec3 scannerBar(vec2 uv, float time, float frequency, float speed, float thickness, vec3 color) {
  float strength = abs(sin(uv.x * frequency + time * speed));
  strength = step(1.0 - thickness * 0.001, strength);

  return strength * color;
}
