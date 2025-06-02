import * as THREE from "three";
import Experience from "../Experience";

class Environment {
  private readonly experience = Experience.getInstance();
  private readonly scene = this.experience.scene;
  private readonly resources = this.experience.resources;
  private readonly debug = this.experience.debug.instance;

  private ambientLight: THREE.AmbientLight;
  private environtmentMap: THREE.CubeTexture;

  private tweaks?: typeof this.debug;

  constructor() {
    this.ambientLight = new THREE.AmbientLight(0x8ea9cc, 0.8);

    this.environtmentMap =
      this.resources.getAsset<THREE.CubeTexture>("space_cubemap");
    this.environtmentMap.colorSpace = THREE.SRGBColorSpace;

    this.scene.environment = this.environtmentMap;
    this.scene.background = this.environtmentMap;
    this.scene.backgroundRotation.set(3.18, 0, 5.89);
    this.scene.backgroundIntensity = 1;

    this.scene.add(this.ambientLight);
    this.setupTweaks();
  }

  private setupTweaks() {
    this.tweaks = this.debug.addFolder("Environment");

    const debugObj = {
      ambientLightColor: this.ambientLight.color.getHex(),
    };

    const lightTweaks = this.tweaks.addFolder("Ambient Light");
    lightTweaks
      .addColor(debugObj, "ambientLightColor")
      .onChange(() => {
        this.ambientLight.color.set(debugObj.ambientLightColor);
      })
      .name("Color");
    lightTweaks
      .add(this.ambientLight, "intensity")
      .min(0)
      .max(2)
      .step(0.01)
      .name("Intensity");

    const backgroundTweaks = this.tweaks.addFolder("Background");
    backgroundTweaks
      .add(this.scene.backgroundRotation, "x")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("Rotation X");
    backgroundTweaks
      .add(this.scene.backgroundRotation, "y")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("Rotation Y");
    backgroundTweaks
      .add(this.scene.backgroundRotation, "z")
      .min(0)
      .max(Math.PI * 2)
      .step(0.01)
      .name("Rotation Z");

    backgroundTweaks
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
    this.tweaks?.destroy();
  }
}

export default Environment;
