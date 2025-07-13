import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../../Experience";
import HologramMaterial from "../materials/HologramMaterial";
import gsap from "gsap";
import type GUI from "lil-gui";

type VariantName = "highpoly" | "lego" | "funko";
type Variant = {
  name: VariantName;
  mesh: THREE.Mesh;
  originalScale: THREE.Vector3;
};

class VaderHologram {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly audioRegistry = this.experience.audioRegistry;
  private readonly listener = this.experience.listener;

  private variants!: Variant[];
  private activeVariantIndex: number = 0;
  private material!: HologramMaterial;
  private breathAudio!: THREE.PositionalAudio;
  private hologramSwitchAudio!: THREE.PositionalAudio;

  private raycaster: THREE.Raycaster;
  private mousePosition: THREE.Vector2;
  private isAnimating: boolean = false;

  constructor(defaultVariant: VariantName, root: THREE.Object3D) {
    this.setupMeshes();
    this.activeVariantIndex = this.variants.findIndex(
      (item) => item.name === defaultVariant
    );
    if (this.activeVariantIndex === -1) this.activeVariantIndex = 0;
    this.setupMaterial();
    this.variants.forEach((variant) => root.add(variant.mesh));

    this.setupAudio();
    this.raycaster = new THREE.Raycaster();
    this.mousePosition = new THREE.Vector2();
    this.setupMouseInteraction();
  }

  update() {
    this.material.update();
  }

  dispose() {
    this.variants.forEach((item) => item.mesh.geometry.dispose());
    this.material.dispose();
    this.breathAudio.stop();
    this.breathAudio.disconnect();
    this.hologramSwitchAudio.stop();
    this.hologramSwitchAudio.disconnect();
  }

  setupTweaks(gui: GUI) {
    this.material.setupTweaks(gui);
  }

  private setupMeshes() {
    const highpolyMesh = this.getMeshFromGLTF("highpoly_vader_model", 0.05);
    const legoMesh = this.getMeshFromGLTF("lego_vader_model", 0.1);
    const funkoMesh = this.getMeshFromGLTF("funko_vader_model", 0.1);
    this.variants = [
      {
        name: "highpoly",
        mesh: highpolyMesh,
        originalScale: highpolyMesh.scale.clone(),
      },
      {
        name: "lego",
        mesh: legoMesh,
        originalScale: legoMesh.scale.clone(),
      },
      {
        name: "funko",
        mesh: funkoMesh,
        originalScale: funkoMesh.scale.clone(),
      },
    ];
    this.variants.forEach((variant, index) => {
      variant.mesh.visible = index === this.activeVariantIndex;
    });
  }

  private setupMaterial() {
    this.material = new HologramMaterial();
    this.variants.forEach(
      (variant) => (variant.mesh.material = this.material.material)
    );
  }

  private setupAudio() {
    const { active } = this.getCycleInfo();
    /* BREATH */
    const breathAudioBuffer = this.resources.get<AudioBuffer>(
      "vader_breathing_audio"
    );
    this.breathAudio = new THREE.PositionalAudio(this.listener);
    this.breathAudio.setBuffer(breathAudioBuffer);
    this.breathAudio.setRefDistance(0.85);
    this.breathAudio.setLoop(true);
    this.breathAudio.setVolume(0.7);
    this.audioRegistry.register("vader_breath", this.breathAudio);

    /* HOLOGRAM SWITCH */
    const switchAudioBuffer = this.resources.get<AudioBuffer>(
      "hologram_switch_audio"
    );
    this.hologramSwitchAudio = new THREE.PositionalAudio(this.listener);
    this.hologramSwitchAudio.setBuffer(switchAudioBuffer);
    this.hologramSwitchAudio.setRefDistance(0.5);
    this.hologramSwitchAudio.setVolume(0.7);
    this.audioRegistry.register("hologram_switch", this.hologramSwitchAudio);

    active.mesh.add(this.breathAudio, this.hologramSwitchAudio);

    window.addEventListener("click", this.playAudio);
    window.addEventListener("touchend", this.playAudio);
  }

  private playAudio = () => {
    if (!this.breathAudio.isPlaying) this.breathAudio.play();
    window.removeEventListener("click", this.playAudio);
    window.removeEventListener("touchend", this.playAudio);
  };

  private getMeshFromGLTF(fileName: string, offsetY = 0): THREE.Mesh {
    const file = this.resources.get<GLTF>(fileName);
    const obj = file.scene.getObjectByName("darth_vader");
    if (!(obj instanceof THREE.Mesh))
      throw new Error(`${fileName} Mesh couldn't be found`);
    obj.position.y += offsetY;
    return obj;
  }

  private setupMouseInteraction() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("click", this.handleMouseClick);
  }

  private handleMouseClick = () => {
    const { active } = this.getCycleInfo();
    const intersect = this.raycaster.intersectObject(active.mesh);
    if (intersect.length > 0) {
      this.switchVariant();
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.mousePosition.x =
      (event.clientX / this.experience.sizes.width) * 2 - 1;
    this.mousePosition.y =
      -(event.clientY / this.experience.sizes.height) * 2 + 1;
    this.raycaster.setFromCamera(
      this.mousePosition,
      this.experience.camera.instance
    );

    const { active } = this.getCycleInfo();
    const intersect = this.raycaster.intersectObject(active.mesh);
    if (intersect.length > 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  };

  private getCycleInfo(): {
    active: Variant;
    next: Variant;
    nextIndex: number;
  } {
    const active = this.variants[this.activeVariantIndex];
    const nextIndex = (this.activeVariantIndex + 1) % this.variants.length;
    const next = this.variants[nextIndex];
    if (!active || !next) throw new Error("Variants not properly initialized");

    return {
      active,
      next,
      nextIndex,
    };
  }

  private switchVariant() {
    if (this.isAnimating || this.hologramSwitchAudio.isPlaying) return;
    this.isAnimating = true;
    this.hologramSwitchAudio.play();

    const { active, next, nextIndex } = this.getCycleInfo();
    const activeToScale = active.originalScale.clone().multiplyScalar(0.5);
    const nextFromScale = new THREE.Vector3(0, 0, 0);

    const timeline = gsap.timeline({
      onComplete: () => {
        this.breathAudio.parent?.remove(this.breathAudio);
        this.hologramSwitchAudio.parent?.remove(this.hologramSwitchAudio);
        next.mesh.add(this.breathAudio, this.hologramSwitchAudio);
        this.activeVariantIndex = nextIndex;
        this.isAnimating = false;
      },
    });

    timeline.to(
      this.material.material.uniforms.uOpacity,
      { value: 0, duration: 0.5, ease: "power2.inOut" },
      0
    );

    timeline.to(
      active.mesh.scale,
      {
        ...activeToScale,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          active.mesh.visible = false;
          next.mesh.visible = true;
          next.mesh.scale.copy(nextFromScale);
        },
      },
      0
    );

    timeline.to(
      this.material.material.uniforms.uOpacity,
      { value: 1, duration: 0.5, ease: "power2.inOut" },
      0.5
    );

    timeline.to(
      next.mesh.scale,
      { ...next.originalScale, duration: 0.5, ease: "power2.inOut" },
      0.5
    );
  }
}

export default VaderHologram;
