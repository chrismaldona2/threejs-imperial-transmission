import * as THREE from "three";
import Experience from "./Experience";
import type GUI from "lil-gui";

class Renderer {
  private readonly experience = Experience.getInstance();
  private readonly canvas = this.experience.canvas.domElement;
  private readonly sizes = this.experience.sizes;
  private readonly scene = this.experience.scene;
  private readonly camera = this.experience.camera.instance;
  private readonly debug = this.experience.debug.instance;

  readonly instance: THREE.WebGLRenderer;
  private tweaks?: GUI;

  constructor() {
    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.outputColorSpace = THREE.SRGBColorSpace;
  }

  setupTweaks() {
    /* ↓ THIS TWEAKS WON'T WORK IF POSTPROCESSING IS ENABLED */
    this.tweaks = this.debug.addFolder("Renderer");

    this.tweaks
      .add(this.instance, "toneMapping")
      .options({
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
      })
      .name("Tone Mapping");

    this.tweaks
      .add(this.instance, "toneMappingExposure")
      .min(0)
      .max(2)
      .step(0.01)
      .name("Tone Mapping Exposure");
  }

  update() {
    this.instance.render(this.scene, this.camera);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  dispose() {
    this.instance.dispose();
    this.tweaks?.destroy();
  }
}

export default Renderer;
