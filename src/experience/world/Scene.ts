import * as THREE from "three";
import Experience from "../Experience";
import HologramEffect from "./HologramEffect";
import type { GLTF } from "three/examples/jsm/Addons.js";
import LightSpotEffect from "./LightSpotEffect";

class Scene {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly gui = this.experience.debug.instance;

  private model: THREE.Object3D;
  private darthVader: THREE.Mesh;
  private light: THREE.Mesh;
  private lightSource: THREE.Mesh;
  private holoprojector: THREE.Mesh;
  private holoprojectorGold: THREE.Mesh;
  private holoprojectorScreen: THREE.Mesh;

  private vaderHologramEffect: HologramEffect;
  private lightSpotEffect: LightSpotEffect;

  constructor() {
    const gltf = this.resources.getAsset<GLTF>("scene_model");
    const bakeTexture = this.resources.getAsset<THREE.Texture>("scene_texture");

    const goldMatcap = this.resources.getAsset<THREE.Texture>("gold_matcap");
    const screenMatcap =
      this.resources.getAsset<THREE.Texture>("screen_matcap");

    bakeTexture.flipY = false;
    this.model = gltf.scene;
    this.model.position.y -= 0.5;

    this.darthVader = this.getMesh("darth_vader");
    this.light = this.getMesh("hologram_light");
    this.lightSource = this.getMesh("hologram_light_source");
    this.holoprojector = this.getMesh("holoprojector_chamber");
    this.holoprojectorGold = this.getMesh("hologram_chamber_proyector_gold");
    this.holoprojectorScreen = this.getMesh("holoprojector_controls");

    this.vaderHologramEffect = new HologramEffect();
    this.lightSpotEffect = new LightSpotEffect();

    this.darthVader.material = this.vaderHologramEffect.material;
    this.light.material = this.lightSpotEffect.material;
    this.lightSource.material = new THREE.MeshBasicMaterial({
      color: 0xe0eeff,
    });
    this.holoprojector.material = new THREE.MeshBasicMaterial({
      map: bakeTexture,
    });
    this.holoprojectorGold.material = new THREE.MeshMatcapMaterial({
      matcap: goldMatcap,
    });
    this.holoprojectorScreen.material = new THREE.MeshMatcapMaterial({
      matcap: screenMatcap,
    });

    this.experience.scene.add(this.model);
    this.setupTweaks();
  }

  private getMesh(name: string): THREE.Mesh {
    const mesh = this.model.getObjectByName(name);

    if (!mesh || !(mesh instanceof THREE.Mesh)) {
      throw new Error(`Couldn’t find mesh named "${name}"`);
    }

    return mesh;
  }

  private setupTweaks() {
    if (this.lightSource.material instanceof THREE.MeshBasicMaterial) {
      const debugObj = {
        lightSourceColor: this.lightSource.material.color.getHex(),
      };

      this.gui.addColor(debugObj, "lightSourceColor").onChange(() => {
        if (this.lightSource.material instanceof THREE.MeshBasicMaterial)
          this.lightSource.material.color.set(debugObj.lightSourceColor);
      });
    }
  }

  update() {
    this.vaderHologramEffect.update();
    this.lightSpotEffect.update();
  }
}
export default Scene;
