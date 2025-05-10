import * as THREE from "three";
import Experience from "../Experience";
import HologramEffect from "./HologramEffect";
import type { GLTF } from "three/examples/jsm/Addons.js";

class VaderHologram {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  private vaderMesh!: THREE.Mesh;
  private vaderHologramEffect: HologramEffect;

  constructor() {
    const gltf = this.resources.getAsset<GLTF>("darth_vader_model");
    const model = gltf.scene;

    model.position.y -= 0.5;
    const darth_vader = model.getObjectByName("darth_vader");

    this.vaderHologramEffect = new HologramEffect();

    if (darth_vader instanceof THREE.Mesh) {
      this.vaderMesh = darth_vader;
      this.vaderMesh.material = this.vaderHologramEffect.material;
    }

    this.experience.scene.add(model);
  }

  update() {
    this.vaderHologramEffect.update();
  }
}
export default VaderHologram;
