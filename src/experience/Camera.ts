import * as THREE from "three";
import Experience from "./Experience";
import { OrbitControls } from "three/examples/jsm/Addons.js";

class Camera {
  private readonly experience = Experience.getInstance();
  private readonly sizes = this.experience.sizes;
  private readonly scene = this.experience.scene;
  private readonly canvas = this.experience.canvas.domElement;

  readonly instance: THREE.PerspectiveCamera;
  readonly controls: OrbitControls;

  constructor() {
    this.instance = new THREE.PerspectiveCamera(
      40,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    );
    this.instance.position.set(2, 2, 4);

    this.controls = new OrbitControls(this.instance, this.canvas);
    this.controls.enableDamping = true;
    this.controls.target.set(0, -0.25, 0);

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

  dispose() {
    this.controls.dispose();
  }
}

export default Camera;
