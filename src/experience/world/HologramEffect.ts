import * as THREE from "three";
import vertexShader from "../../shaders/hologram/vertex.glsl";
import fragmentShader from "../../shaders/hologram/fragment.glsl";
import Experience from "../Experience";

class HologramEffect {
  private readonly experience = Experience.getInstance();
  private readonly timer = this.experience.timer;
  private readonly debug = this.experience.debug.instance;

  material: THREE.ShaderMaterial;

  constructor() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uAnimationSpeed: new THREE.Uniform(0.01),
        uColor: new THREE.Uniform(new THREE.Color(0x2475cc)),
        uStripesAmount: new THREE.Uniform(70),
        uStripeSharpness: new THREE.Uniform(3),
        uFresnelSharpness: new THREE.Uniform(1.5),
        uFresnelBoost: new THREE.Uniform(1.5),
        uFresnelFalloffStart: new THREE.Uniform(0.9),
        uGlitchIntensity: new THREE.Uniform(0.05),
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
  }

  setupTweaks(gui: typeof this.debug) {
    const debugObj = {
      color: this.material.uniforms.uColor.value.getHex(),
    };
    gui
      .add(this.material, "blending")
      .options({
        NormalBlending: THREE.NormalBlending,
        AdditiveBlending: THREE.AdditiveBlending,
        SubtractiveBlending: THREE.SubtractiveBlending,
        MultiplyBlending: THREE.MultiplyBlending,
      })
      .name("Blending Mode");
    gui
      .addColor(debugObj, "color")
      .onChange(() => {
        this.material.uniforms.uColor.value.set(debugObj.color);
      })
      .name("Color");
    gui
      .add(this.material.uniforms.uGlitchIntensity, "value")
      .min(0)
      .max(0.5)
      .step(0.001)
      .name("Glitch Intensity");
    gui
      .add(this.material.uniforms.uAnimationSpeed, "value")
      .min(0)
      .max(0.1)
      .step(0.001)
      .name("Animation Speed");
    gui
      .add(this.material.uniforms.uStripesAmount, "value")
      .min(1)
      .max(200)
      .step(1)
      .name("Stripes Amount");
    gui
      .add(this.material.uniforms.uStripeSharpness, "value")
      .min(0)
      .max(10)
      .step(0.1)
      .name("Stripe Sharpness");
    gui
      .add(this.material.uniforms.uFresnelSharpness, "value")
      .min(0)
      .max(10)
      .step(0.1)
      .name("Fresnel Sharpness");
    gui
      .add(this.material.uniforms.uFresnelBoost, "value")
      .min(0)
      .max(10)
      .step(0.1)
      .name("Fresnel Boost");
    gui
      .add(this.material.uniforms.uFresnelFalloffStart, "value")
      .min(0)
      .max(1)
      .step(0.01)
      .name("Fresnel Falloff Start");
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.material.dispose();
  }
}

export default HologramEffect;
