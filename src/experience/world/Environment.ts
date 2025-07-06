import * as THREE from "three";
import Experience from "../Experience";

class Environment {
  private readonly experience = Experience.getInstance();
  private readonly scene = this.experience.scene;
  private readonly resources = this.experience.resources;
  private readonly camera = this.experience.camera.instance;
  private readonly debug = this.experience.debug.instance;

  private ambientLight: THREE.AmbientLight;
  private environmentMap: THREE.CubeTexture;

  private audioListener: THREE.AudioListener;
  private ambientSound: THREE.Audio;
  private ambientSoundBuffer: AudioBuffer;

  private tweaks?: typeof this.debug;

  constructor() {
    this.ambientLight = new THREE.AmbientLight(0x3e536f, 0.6);

    this.environmentMap =
      this.resources.getAsset<THREE.CubeTexture>("space_cubemap");
    this.environmentMap.colorSpace = THREE.SRGBColorSpace;

    this.scene.environment = this.environmentMap;
    this.scene.background = this.environmentMap;
    this.scene.backgroundRotation.set(3.18, 0, 5.89);
    this.scene.backgroundIntensity = 1;

    this.scene.add(this.ambientLight);

    this.audioListener = new THREE.AudioListener();
    this.camera.add(this.audioListener);
    this.ambientSound = new THREE.Audio(this.audioListener);
    this.ambientSoundBuffer =
      this.resources.getAsset<AudioBuffer>("ambient_sound");
    this.ambientSound.setBuffer(this.ambientSoundBuffer);
    this.ambientSound.autoplay = true;
    this.ambientSound.loop = true;
    this.ambientSound.setVolume(0.15);

    window.addEventListener("click", this.playAmbientSound);

    this.setupTweaks();
  }

  private playAmbientSound = () => {
    this.ambientSound.play();
    window.removeEventListener("click", this.playAmbientSound);
  };

  private setupTweaks() {
    this.tweaks = this.debug.addFolder("Environment");

    const debugObj = {
      ambientLightColor: this.ambientLight.color.getHex(),
      ambientSoundVolume: this.ambientSound.getVolume(),
    };

    this.tweaks
      .add(debugObj, "ambientSoundVolume")
      .min(0)
      .step(0.01)
      .max(1)
      .onChange(() => {
        this.ambientSound.setVolume(debugObj.ambientSoundVolume);
      })
      .name("Ambient Sound Volume");

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
    this.environmentMap.dispose();
    this.tweaks?.destroy();
  }
}

export default Environment;
