import Experience from "../Experience";
import * as THREE from "three";
import vertexShader from "../../shaders/lightspot/vertex.glsl";
import fragmentShader from "../../shaders/lightspot/fragment.glsl";
import type GUI from "lil-gui";

class SpotLightMaterial {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly timer = this.experience.timer;

  material: THREE.ShaderMaterial;

  constructor() {
    const noiseTexture =
      this.resources.getAsset<THREE.Texture>("noise_texture");
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;
    noiseTexture.needsUpdate = true;

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uSpeed: new THREE.Uniform(0.145),
        uNoiseTexture: new THREE.Uniform(noiseTexture),
        uNoiseAlphaScale: new THREE.Uniform(0.5),
        uMaxIntensity: new THREE.Uniform(2),
        uFalloffScale: new THREE.Uniform(1.93),
        uFalloffOffset: new THREE.Uniform(1.4),
        uBaseAlpha: new THREE.Uniform(0.096),
        uColorOffset: new THREE.Uniform(0.54),
        uColorTop: new THREE.Uniform(new THREE.Color(0x154584)),
        uColorBottom: new THREE.Uniform(new THREE.Color(0x385e8f)),
      },
      transparent: true,
    });
  }

  setupTweaks(gui: GUI) {
    const debugObj = {
      colorTop: this.material.uniforms.uColorTop.value.getHex(),
      colorBottom: this.material.uniforms.uColorBottom.value.getHex(),
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
      .addColor(debugObj, "colorTop")
      .onChange(() =>
        this.material.uniforms.uColorTop.value.set(debugObj.colorTop)
      )
      .name("Color Top");
    gui
      .addColor(debugObj, "colorBottom")
      .onChange(() =>
        this.material.uniforms.uColorBottom.value.set(debugObj.colorBottom)
      )
      .name("Color Bottom");

    gui
      .add(this.material.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("Color Offset");

    gui
      .add(this.material.uniforms.uMaxIntensity, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("Max Intensity");
    gui
      .add(this.material.uniforms.uNoiseAlphaScale, "value")
      .min(0)
      .max(2)
      .step(0.001)
      .name("Alpha Scale");
    gui
      .add(this.material.uniforms.uSpeed, "value")
      .min(0)
      .max(0.5)
      .step(0.001)
      .name("Speed");

    gui
      .add(this.material.uniforms.uFalloffScale, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("Falloff Scale");
    gui
      .add(this.material.uniforms.uFalloffOffset, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("Falloff Offset");
    gui
      .add(this.material.uniforms.uBaseAlpha, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("Base Alpha");
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.material.dispose();
  }
}

export default SpotLightMaterial;
