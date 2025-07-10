import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Camera {
  private readonly experience = Experience.getInstance();
  private readonly gui = this.experience.debug.instance;
  private readonly sizes = this.experience.sizes;
  private readonly scene = this.experience.scene;
  private readonly canvas = this.experience.canvas.domElement;

  readonly instance: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;
  private tweaks?: typeof this.gui;

  constructor() {
    this.instance = new THREE.PerspectiveCamera(
      65,
      this.sizes.width / this.sizes.height,
      0.01,
      100
    );
    this.instance.position.set(-2, 1.6, 1.5);

    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 2;
    this.controls.maxDistance = 4.5;
    this.controls.target.set(-0.8, 0.25, -2.38);

    /* MOUNT */
    this.scene.add(this.instance);
    this.setupTweaks();
  }

  update() {
    this.controls.update();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  setupTweaks() {
    this.tweaks = this.gui.addFolder("Camera");
    this.tweaks
      .add(this.instance.position, "x")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Position X");
    this.tweaks
      .add(this.instance.position, "y")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Position Y");
    this.tweaks
      .add(this.instance.position, "z")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Position Z");
  }

  dispose() {
    this.controls.dispose();
    this.tweaks?.destroy();
  }
}

export default Camera;
