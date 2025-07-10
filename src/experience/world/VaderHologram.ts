import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import HologramMaterial from "./HologramMaterial";
import gsap from "gsap";
import AudioFader from "../utils/AudioFader";

class VaderHologram {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly audioRegistry = this.experience.audioRegistry;
  private readonly listener = this.experience.listener;

  private activeMesh: "highpoly" | "lego";
  private material!: HologramMaterial;
  private breathAudio!: THREE.PositionalAudio;
  private hologramSwitchAudio!: THREE.PositionalAudio;
  private highPolyMesh!: THREE.Mesh;
  private legoMesh!: THREE.Mesh;

  private highPolyOriginalScale!: THREE.Vector3;
  private legoOriginalScale!: THREE.Vector3;

  private raycaster: THREE.Raycaster;
  private mousePosition: THREE.Vector2;
  private isAnimating: boolean = false;

  constructor(defaultVariant: "highpoly" | "lego", root: THREE.Object3D) {
    this.activeMesh = defaultVariant;
    this.setupMeshes();
    this.setupMaterial();
    this.setupAudio();
    root.add(this.highPolyMesh, this.legoMesh);

    this.raycaster = new THREE.Raycaster();
    this.mousePosition = new THREE.Vector2();
    this.setupMouseInteraction();
  }

  update() {
    this.material.update();
  }

  dispose() {
    this.highPolyMesh.geometry.dispose();
    this.legoMesh.geometry.dispose();
    this.material.dispose();
    this.breathAudio.stop();
    this.breathAudio.disconnect();
    this.hologramSwitchAudio.stop();
    this.hologramSwitchAudio.disconnect();
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("click", this.handleMouseClick);
  }

  private setupMouseInteraction() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("click", this.handleMouseClick);
  }

  private handleMouseClick = () => {
    const { active } = this.getActiveMeshInfo();
    const intersect = this.raycaster.intersectObject(active);
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

    const { active } = this.getActiveMeshInfo();
    const intersect = this.raycaster.intersectObject(active);
    if (intersect.length > 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  };

  private setupMeshes() {
    this.highPolyMesh = this.getMeshFromGLTF("highpoly_vader_model", 0.05);
    this.legoMesh = this.getMeshFromGLTF("lego_vader_model", 0.1);
    this.highPolyOriginalScale = this.highPolyMesh.scale.clone();
    this.legoOriginalScale = this.legoMesh.scale.clone();
    if (this.activeMesh === "highpoly") {
      this.highPolyMesh.visible = true;
      this.legoMesh.visible = false;
    } else {
      this.highPolyMesh.visible = false;
      this.legoMesh.visible = true;
    }
  }

  private setupMaterial() {
    this.material = new HologramMaterial();
    this.highPolyMesh.material = this.material.material;
    this.legoMesh.material = this.material.material;
  }

  private setupAudio() {
    const { active } = this.getActiveMeshInfo();

    /* BREATH */
    const breathAudioBuffer = this.resources.get<AudioBuffer>(
      "vader_breathing_audio"
    );
    this.breathAudio = new THREE.PositionalAudio(this.listener);
    this.breathAudio.setBuffer(breathAudioBuffer);
    this.breathAudio.setRefDistance(0.85);
    this.breathAudio.setLoop(true);
    this.breathAudio.setVolume(0.66);
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
    window.addEventListener("click", this.playBreathAudio);

    active.add(this.breathAudio, this.hologramSwitchAudio);
  }

  private playBreathAudio = () => {
    AudioFader.fadeIn(this.breathAudio, this.breathAudio.getVolume());
    window.removeEventListener("click", this.playBreathAudio);
  };

  private getMeshFromGLTF(fileName: string, offsetY = 0): THREE.Mesh {
    const file = this.resources.get<GLTF>(fileName);
    const obj = file.scene.getObjectByName("darth_vader");
    if (!(obj instanceof THREE.Mesh))
      throw new Error(`${fileName} Mesh couldn't be found`);
    obj.position.y += offsetY;
    return obj;
  }

  private getActiveMeshInfo(): {
    active: THREE.Mesh;
    other: THREE.Mesh;
    activeOriginalScale: THREE.Vector3;
    otherOriginalScale: THREE.Vector3;
  } {
    const isHighpoly = this.activeMesh === "highpoly";
    return {
      active: isHighpoly ? this.highPolyMesh : this.legoMesh,
      other: isHighpoly ? this.legoMesh : this.highPolyMesh,
      activeOriginalScale: isHighpoly
        ? this.highPolyOriginalScale
        : this.legoOriginalScale,
      otherOriginalScale: isHighpoly
        ? this.legoOriginalScale
        : this.highPolyOriginalScale,
    };
  }

  private switchVariant() {
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.hologramSwitchAudio.play();

    const { active, other, activeOriginalScale, otherOriginalScale } =
      this.getActiveMeshInfo();
    const activeMeshHalfScale = activeOriginalScale.clone().multiplyScalar(0.5);

    /* ANIMATION */
    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        this.activeMesh = this.activeMesh === "highpoly" ? "lego" : "highpoly";
      },
    });

    tl.to(
      this.material.material.uniforms.uOpacity,
      {
        value: 0,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0
    );

    tl.to(
      active.scale,
      {
        x: activeMeshHalfScale.x,
        y: activeMeshHalfScale.y,
        z: activeMeshHalfScale.z,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          /* SWITCH LOGIC ↓ */
          // Didn't implement disposing on switch as performance was good, disposing would probably complicate things.
          active.visible = false;
          other.visible = true;
          other.scale.set(0, 0, 0);
          other.add(this.breathAudio, this.hologramSwitchAudio);
        },
      },
      0
    );

    tl.to(
      this.material.material.uniforms.uOpacity,
      {
        value: 1,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0.5
    );

    tl.to(
      other.scale,
      {
        x: otherOriginalScale.x,
        y: otherOriginalScale.y,
        z: otherOriginalScale.z,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0.5
    );
  }
}

export default VaderHologram;
