import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import HologramMaterial from "./HologramMaterial";

class VaderHologram {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  currentMesh: THREE.Mesh;
  hologramMaterial: HologramMaterial;

  raycaster: THREE.Raycaster;
  mousePosition: THREE.Vector2;

  constructor() {
    this.currentMesh = this.getVaderMesh();

    this.hologramMaterial = new HologramMaterial();
    this.currentMesh.material = this.hologramMaterial.material;

    this.raycaster = new THREE.Raycaster();
    this.mousePosition = new THREE.Vector2();
    this.setupMouseInteraction();
  }
  swapHologram() {
    const parent = this.currentMesh.parent;
    if (!parent) return;

    parent.remove(this.currentMesh);
    this.currentMesh.geometry.dispose();

    const isLego = this.currentMesh.name === "lego";
    this.currentMesh = isLego ? this.getVaderMesh() : this.getVaderLegoMesh();
    this.currentMesh.name = isLego ? "vader" : "lego";

    this.currentMesh.material = this.hologramMaterial.material;

    parent.add(this.currentMesh);
  }

  update() {
    this.hologramMaterial.update();
  }

  dispose() {
    this.hologramMaterial.dispose();
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("click", this.handleMouseClick);
  }

  private setupMouseInteraction() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("click", this.handleMouseClick);
  }

  private getVaderMesh(): THREE.Mesh {
    const vaderGltf = this.resources.getAsset<GLTF>("darth_vader_model");
    const original = vaderGltf.scene.getObjectByName("darth_vader");
    if (!(original instanceof THREE.Mesh)) throw new Error();

    const mesh = original.clone(true) as THREE.Mesh;
    mesh.geometry = original.geometry.clone();
    mesh.name = "vader";
    return mesh;
  }

  private getVaderLegoMesh(): THREE.Mesh {
    const vaderGltf = this.resources.getAsset<GLTF>("darth_vader_lego_model");
    const original = vaderGltf.scene.getObjectByName("darth_vader");
    if (!(original instanceof THREE.Mesh)) throw new Error();

    const mesh = original.clone(true) as THREE.Mesh;
    mesh.geometry = original.geometry.clone();
    mesh.name = "lego";
    return mesh;
  }

  private handleMouseClick = () => {
    const intersect = this.raycaster.intersectObject(this.currentMesh);

    if (intersect.length > 0) {
      this.swapHologram();
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
    const intersect = this.raycaster.intersectObject(this.currentMesh);
    if (intersect.length > 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  };
}

export default VaderHologram;
