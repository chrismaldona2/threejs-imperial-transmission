import * as THREE from "three";
import vertexShader from "../../shaders/hologram/vertex.glsl";
import fragmentShader from "../../shaders/hologram/fragment.glsl";
import Experience from "../Experience";

class HologramEffect {
  private readonly timer = Experience.getInstance().timer;
  material: THREE.ShaderMaterial;
  color: string = "#36628e";

  constructor() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uAnimationSpeed: new THREE.Uniform(0.01),
        uColor: new THREE.Uniform(new THREE.Color(this.color)),
        uStripesAmount: new THREE.Uniform(100),
        uStripeSharpness: new THREE.Uniform(3),
        uFresnelSharpness: new THREE.Uniform(1.5),
        uFresnelBoost: new THREE.Uniform(1.5),
        uFresnelFalloffStart: new THREE.Uniform(0.9),
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.material.dispose();
  }
}

export default HologramEffect;
