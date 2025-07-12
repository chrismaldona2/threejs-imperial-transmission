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

  private minBoundaries: THREE.Vector3;
  private maxBoundaries: THREE.Vector3;

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
    this.controls.dampingFactor = 0.04;
    this.controls.panSpeed = 0.9;
    this.controls.minDistance = 1.5;
    this.controls.minZoom = 1.5;
    this.controls.target.set(-0.8, 0.25, -2.38);

    this.minBoundaries = new THREE.Vector3(-2.85, -0.65, -4.6);
    this.maxBoundaries = new THREE.Vector3(2.33, 2.45, 2.75);
    this.controls.addEventListener("change", this.handleBoundaries);

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
    this.controls.removeEventListener("change", this.handleBoundaries);
    this.controls.dispose();
  }

  private handleBoundaries = () => {
    const allowedPosition = this.instance.position
      .clone()
      .clamp(this.minBoundaries, this.maxBoundaries);
    this.instance.position.lerp(allowedPosition, 0.25);
  };
}

export default Camera;
