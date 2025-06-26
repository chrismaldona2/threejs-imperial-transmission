varying vec2 vUv;
uniform float uTime;
uniform float uAnimationSpeed;

uniform float uLinesAspectScale;
uniform float uRadialLinesCount;
uniform vec3 uBackgroundColor;
uniform vec3 uLinesColor;
uniform float uLinesThickness;

uniform float uBordersThickness;
uniform float uBordersMargin;
uniform vec3 uBordersColor;

uniform float uCrossThickness;
uniform float uCrossSize;
uniform vec3 uCrossColor;


#define PI 3.14159265359

float drawLine(float coord, float thickness) {
  return smoothstep(thickness, 0.0, abs(fract(coord) - 0.5));
}

void main() {
  vec2 adjustedUv = vUv - 0.5;
  adjustedUv.x *= uLinesAspectScale;
  float angle = atan(adjustedUv.y, adjustedUv.x);
  float radius = length(adjustedUv);
  float tunnel = fract(radius * 10.0 - uTime * uAnimationSpeed);
  float radialLines = drawLine(angle / (2.0 * PI) * uRadialLinesCount, uLinesThickness);
  float slices = drawLine(radius * 5.0 - uTime * uAnimationSpeed, uLinesThickness);
  float lines = max(radialLines, slices);

  float leftBorder = step(uBordersMargin, vUv.x) - step(uBordersMargin + uBordersThickness, vUv.x);
  float rightBorder = step(1.0 - uBordersMargin, vUv.x) - step(1.0 - uBordersMargin + uBordersThickness, vUv.x);
  float borders = max(leftBorder, rightBorder);

  float crossXLine = min(step(-uCrossThickness, adjustedUv.x) - step(uCrossThickness, adjustedUv.x), step(-uCrossSize, adjustedUv.y) - step(uCrossSize, adjustedUv.y));
  float crossYLine = min(step(-uCrossThickness, adjustedUv.y) - step(uCrossThickness, adjustedUv.y), step(-uCrossSize, adjustedUv.x) - step(uCrossSize, adjustedUv.x));
  float _cross = max(crossXLine, crossYLine);

  vec3 col = mix(uBackgroundColor, uLinesColor, lines);
  col = mix(col, uBordersColor, borders);
  col = mix(col, uCrossColor, _cross);

  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}
