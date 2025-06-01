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
  private debugFolder?: typeof this.gui;

  constructor() {
    this.instance = new THREE.PerspectiveCamera(
      70,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(2, 1, 3);

    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, -0.25, 0);
    this.controls.enablePan = false;
    this.controls.maxDistance = 4;

    /* MOUNT */
    this.scene.add(this.instance);
  }

  update() {
    this.controls.update();
  }

  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height;
    this.instance.updateProjectionMatrix();
  }

  setupTweaks() {
    this.debugFolder = this.gui.addFolder("Camera");
    this.debugFolder
      .add(this.instance.position, "x")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Position X");
    this.debugFolder
      .add(this.instance.position, "y")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Position Y");
    this.debugFolder
      .add(this.instance.position, "z")
      .min(-5)
      .max(5)
      .step(0.01)
      .name("Position Z");
  }

  dispose() {
    this.controls.dispose();
    this.debugFolder?.destroy();
  }
}

export default Camera;
