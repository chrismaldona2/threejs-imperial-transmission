import * as THREE from "three";
import Experience from "../Experience";
import HologramEffect from "./HologramEffect";
import type { GLTF } from "three/examples/jsm/Addons.js";
import LightSpotEffect from "./LightSpotEffect";

class Scene {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly gui = this.experience.debug.instance;

  private vaderMesh!: THREE.Mesh;
  private lightMesh!: THREE.Mesh;
  private lightSourceMesh!: THREE.Mesh;
  private holoprojectorMesh!: THREE.Mesh;

  private vaderHologramEffect: HologramEffect;
  private lightSpotEffect: LightSpotEffect;

  constructor() {
    const gltf = this.resources.getAsset<GLTF>("scene_model");
    const texture = this.resources.getAsset<THREE.Texture>("scene_texture");
    texture.flipY = false;

    const model = gltf.scene;
    model.position.y -= 0.5;

    const darth_vader = model.getObjectByName("darth_vader");
    const light = model.getObjectByName("hologram_light");
    const lightSource = model.getObjectByName("hologram_light_source");
    const holoprojector = model.getObjectByName("holoprojector_chamber");

    this.vaderHologramEffect = new HologramEffect();
    this.lightSpotEffect = new LightSpotEffect();

    if (darth_vader instanceof THREE.Mesh) {
      this.vaderMesh = darth_vader;
      this.vaderMesh.material = this.vaderHologramEffect.material;
    }

    if (light instanceof THREE.Mesh) {
      this.lightMesh = light;
      this.lightMesh.material = this.lightSpotEffect.material;
    }

    if (lightSource instanceof THREE.Mesh) {
      this.lightSourceMesh = lightSource;
      lightSource.material = new THREE.MeshBasicMaterial({ color: 0xe0eeff });
    }

    if (holoprojector instanceof THREE.Mesh) {
      this.holoprojectorMesh = holoprojector;
      holoprojector.material = new THREE.MeshBasicMaterial({ map: texture });
    }

    this.experience.scene.add(model);
    this.setupTweaks();
  }

  setupTweaks() {
    if (this.lightSourceMesh.material instanceof THREE.MeshBasicMaterial) {
      const debugObj = {
        lightSourceColor: this.lightSourceMesh.material.color.getHex(),
      };

      this.gui.addColor(debugObj, "lightSourceColor").onChange(() => {
        if (this.lightSourceMesh.material instanceof THREE.MeshBasicMaterial)
          this.lightSourceMesh.material.color.set(debugObj.lightSourceColor);
      });
    }
  }

  update() {
    this.vaderHologramEffect.update();
    this.lightSpotEffect.update();
  }
}
export default Scene;
