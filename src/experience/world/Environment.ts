import * as THREE from "three";
import Experience from "../Experience";

class Environment {
  private readonly experience = Experience.getInstance();
  private readonly scene = this.experience.scene;

  private ambientLight: THREE.AmbientLight;

  constructor() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);
  }

  dispose() {
    this.scene.remove(this.ambientLight);
    this.ambientLight.dispose();
  }
}

export default Environment;
