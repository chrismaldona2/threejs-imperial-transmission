import * as THREE from "three";
import type GUI from "lil-gui";

class GlassMaterial {
  material: THREE.MeshPhongMaterial;

  constructor() {
    this.material = new THREE.MeshPhongMaterial({
      color: 0xdae5fb,
      transparent: true,
      opacity: 0.14,
      shininess: 120,
      fog: false,
      depthWrite: false,
      combine: THREE.MixOperation,
    });
  }

  dispose() {
    this.material.dispose();
  }

  setupTweaks(debugFolder: GUI) {
    const controls = {
      color: this.material.specular.getHex(),
    };

    debugFolder
      .addColor(controls, "color")
      .name("Color")
      .onChange(() => {
        this.material.color.set(controls.color);
      });
    debugFolder
      .add(this.material, "opacity")
      .name("Opacity")
      .min(0)
      .max(1)
      .step(0.001);
  }
}

export default GlassMaterial;
