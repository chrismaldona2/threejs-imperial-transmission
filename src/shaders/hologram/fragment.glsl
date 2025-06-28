varying vec3 vPosition;
varying vec3 vNormal;

uniform float uTime;
uniform float uAnimationSpeed;
uniform vec3 uColor;
uniform float uStripesAmount;
uniform float uStripeSharpness;
uniform float uFresnelSharpness;
uniform float uFresnelBoost;
uniform float uFresnelFalloffStart;


void main() {
  vec3 normal = normalize(vNormal);
  if (!gl_FrontFacing) normal *= -1.0;

  /* STRIPES */
  float stripes = mod((vPosition.y - uTime * uAnimationSpeed) * uStripesAmount, 1.0);
  stripes = pow(stripes, uStripeSharpness);

  /* FRESNEL */
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  float fresnel = dot(viewDirection, normal) + 1.0;
  fresnel = pow(fresnel, uFresnelSharpness);

  /* FALLOFF */
  float falloff = smoothstep(uFresnelFalloffStart, 0.0, fresnel);

  float strength = stripes * fresnel;
  strength += fresnel * uFresnelBoost;
  strength *= falloff;

  gl_FragColor = vec4(uColor, strength);
  #include <colorspace_fragment>
  #include <tonemapping_fragment>
}