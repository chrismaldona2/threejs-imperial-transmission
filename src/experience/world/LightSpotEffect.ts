import Experience from "../Experience";
import * as THREE from "three";
import vertexShader from "../../shaders/lightspot/vertex.glsl";
import fragmentShader from "../../shaders/lightspot/fragment.glsl";

class LightSpotEffect {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly timer = this.experience.timer;
  private readonly gui = this.experience.debug.instance;

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
        uMaxIntensity: new THREE.Uniform(1.4),
        uFalloffScale: new THREE.Uniform(1.93),
        uFalloffOffset: new THREE.Uniform(1.14),
        uBaseAlpha: new THREE.Uniform(0.096),
        uColorOffset: new THREE.Uniform(0.54),
        uColorTop: new THREE.Uniform(new THREE.Color(0x82a3c4)),
        uColorBottom: new THREE.Uniform(new THREE.Color(0x6fa4c8)),
      },
      transparent: true,
    });
  }

  setupTweaks() {
    const debugObj = {
      colorTop: this.material.uniforms.uColorTop.value.getHex(),
      colorBottom: this.material.uniforms.uColorBottom.value.getHex(),
    };

    this.gui
      .add(this.material.uniforms.uNoiseAlphaScale, "value")
      .min(0)
      .max(2)
      .step(0.001)
      .name("alphaScale");
    this.gui
      .add(this.material.uniforms.uSpeed, "value")
      .min(0)
      .max(0.5)
      .step(0.001)
      .name("Speed");
    this.gui
      .add(this.material.uniforms.uMaxIntensity, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("maxIntensity");
    this.gui
      .add(this.material.uniforms.uFalloffScale, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("falloffScale");
    this.gui
      .add(this.material.uniforms.uFalloffOffset, "value")
      .min(0)
      .max(5)
      .step(0.001)
      .name("falloffOffset");
    this.gui
      .add(this.material.uniforms.uBaseAlpha, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("baseAlpha");
    this.gui
      .add(this.material.uniforms.uColorOffset, "value")
      .min(0)
      .max(1)
      .step(0.001)
      .name("colorOffset");
    this.gui
      .addColor(debugObj, "colorTop")
      .onChange(() =>
        this.material.uniforms.uColorTop.value.set(debugObj.colorTop)
      );
    this.gui
      .addColor(debugObj, "colorBottom")
      .onChange(() =>
        this.material.uniforms.uColorBottom.value.set(debugObj.colorBottom)
      );
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.material.dispose();
  }
}

export default LightSpotEffect;
