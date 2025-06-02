import * as THREE from "three";
import Experience from "../Experience";
import type GUI from "lil-gui";

class Environment {
  private readonly experience = Experience.getInstance();
  private readonly scene = this.experience.scene;
  private readonly resources = this.experience.resources;
  private readonly debug = this.experience.debug.instance;

  private ambientLight: THREE.AmbientLight;
  private environtmentMap: THREE.CubeTexture;

  private gui?: GUI;

  constructor() {
    this.ambientLight = new THREE.AmbientLight(0x1a1f4a, 0.5);

    this.environtmentMap =
      this.resources.getAsset<THREE.CubeTexture>("space_cubemap");
    this.environtmentMap.colorSpace = THREE.SRGBColorSpace;

    this.scene.environment = this.environtmentMap;
    this.scene.background = this.environtmentMap;
    this.scene.backgroundRotation.set(3.18, 0, 5.89);
    this.scene.backgroundIntensity = 0.4;

    this.scene.add(this.ambientLight);
    this.setupTweaks();
  }

  private setupTweaks() {
    this.gui = this.debug.addFolder("Background");

    this.gui
      .add(this.scene.backgroundRotation, "x")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("Rotation X");
    this.gui
      .add(this.scene.backgroundRotation, "y")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("Rotation Y");
    this.gui
      .add(this.scene.backgroundRotation, "z")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("Rotation Z");

    this.gui
      .add(this.scene, "backgroundIntensity")
      .min(0)
      .max(1)
      .step(0.01)
      .name("Intensity");
  }

  dispose() {
    this.scene.remove(this.ambientLight);
    this.ambientLight.dispose();
    this.environtmentMap.dispose();
    this.gui?.destroy();
  }
}

export default Environment;
