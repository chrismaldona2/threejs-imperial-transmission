import * as THREE from "three";
import vertexShader from "../../shaders/hologram/vertex.glsl";
import fragmentShader from "../../shaders/hologram/fragment.glsl";
import Experience from "../Experience";
import type GUI from "lil-gui";

interface HologramMaterialOptions {
  color?: THREE.ColorRepresentation;
  animationSpeed?: number;
  stripesAmount?: number;
  stripeSharpness?: number;
  fresnelSharpness?: number;
  fresnelBoost?: number;
  fresnelFalloffStart?: number;
  glitchIntensity?: number;
  blending?: THREE.Blending;
}

class HologramMaterial {
  private readonly experience = Experience.getInstance();
  private readonly timer = this.experience.timer;

  material: THREE.ShaderMaterial;

  constructor(options: HologramMaterialOptions = {}) {
    const defaults: HologramMaterialOptions = {
      color: 0x2475cc,
      animationSpeed: 0.01,
      stripesAmount: 70,
      stripeSharpness: 3,
      fresnelSharpness: 1.5,
      fresnelBoost: 1.5,
      fresnelFalloffStart: 0.9,
      glitchIntensity: 0.05,
      blending: THREE.AdditiveBlending,
    };
    const config = { ...defaults, ...options };

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uAnimationSpeed: new THREE.Uniform(config.animationSpeed),
        uColor: new THREE.Uniform(new THREE.Color(config.color)),
        uStripesAmount: new THREE.Uniform(config.stripesAmount),
        uStripeSharpness: new THREE.Uniform(config.stripeSharpness),
        uFresnelSharpness: new THREE.Uniform(config.fresnelSharpness),
        uFresnelBoost: new THREE.Uniform(config.fresnelBoost),
        uFresnelFalloffStart: new THREE.Uniform(config.fresnelFalloffStart),
        uGlitchIntensity: new THREE.Uniform(config.glitchIntensity),
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: config.blending,
    });
  }

  setupTweaks(gui: GUI) {
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

export default HologramMaterial;
