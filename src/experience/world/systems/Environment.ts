import * as THREE from "three";
import Experience from "../../Experience";
import type GUI from "lil-gui";

class Environment {
  private readonly experience = Experience.getInstance();
  private readonly scene = this.experience.scene;
  private readonly resources = this.experience.resources;
  private readonly audioRegistry = this.experience.audioRegistry;
  private readonly listener = this.experience.listener;
  private readonly debug = this.experience.debug.instance;

  private ambientLight!: THREE.AmbientLight;
  private environmentMap!: THREE.CubeTexture;
  private ambientSound!: THREE.Audio;
  private backgroundMusic!: THREE.Audio;

  private tweaks?: GUI;

  constructor() {
    this.setupLights();
    this.setupScene();
    this.setupAudio();
    this.setupTweaks();
  }

  private setupLights() {
    this.ambientLight = new THREE.AmbientLight(0x3e536f, 0.6);
    this.scene.add(this.ambientLight);
  }

  private setupScene() {
    this.environmentMap =
      this.resources.get<THREE.CubeTexture>("space_cubemap");
    this.environmentMap.colorSpace = THREE.SRGBColorSpace;
    this.scene.environment = this.environmentMap;
    this.scene.background = this.environmentMap;
    this.scene.backgroundRotation.set(3.18, 0, 5.89);
    this.scene.backgroundIntensity = 1;
  }

  private setupAudio() {
    this.ambientSound = new THREE.Audio(this.listener);
    const ambientSoundBuffer = this.resources.get<AudioBuffer>("ambient_sound");
    this.ambientSound.setBuffer(ambientSoundBuffer);
    this.ambientSound.loop = true;
    this.ambientSound.setVolume(0.66);
    this.audioRegistry.register("ambient_sound", this.ambientSound);

    const droidMarchBuffer =
      this.resources.get<AudioBuffer>("droid_march_audio");
    this.backgroundMusic = new THREE.Audio(this.listener);
    this.backgroundMusic.setBuffer(droidMarchBuffer);
    this.backgroundMusic.setVolume(0.077);
    this.backgroundMusic.loop = true;
    this.audioRegistry.register("background_music", this.backgroundMusic);

    window.addEventListener("click", this.playAudio);
    window.addEventListener("touchend", this.playAudio);
  }

  private playAudio = () => {
    if (!this.ambientSound.isPlaying) this.ambientSound.play();
    if (!this.backgroundMusic.isPlaying) this.backgroundMusic.play();
    window.removeEventListener("click", this.playAudio);
    window.removeEventListener("touchend", this.playAudio);
  };

  private setupTweaks() {
    this.tweaks = this.debug.addFolder("Environment");
    const controls = {
      ambientLightColor: this.ambientLight.color.getHex(),
    };

    const lightTweaks = this.tweaks.addFolder("Ambient Light");
    lightTweaks
      .addColor(controls, "ambientLightColor")
      .onChange(() => {
        this.ambientLight.color.set(controls.ambientLightColor);
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
    this.tweaks?.destroy();
    this.scene.remove(this.ambientLight);
    this.ambientLight.dispose();
    this.environmentMap.dispose();
    this.ambientSound.stop();
    this.ambientSound.disconnect();
  }
}

export default Environment;
