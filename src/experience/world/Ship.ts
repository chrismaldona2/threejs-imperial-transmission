import * as THREE from "three";
import Experience from "../Experience";
import HologramEffect from "./HologramEffect";
import type { GLTF } from "three/examples/jsm/Addons.js";
import LightSpotEffect from "./LightSpotEffect";

class Ship {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly gui = this.experience.debug.instance;

  private model: THREE.Object3D;
  private vaderHologramEffect?: HologramEffect;
  private lightSpotEffect?: LightSpotEffect;

  constructor() {
    const gltf = this.resources.getAsset<GLTF>("scene_model");
    this.model = gltf.scene;
    this.model.position.y -= 0.5;
    this.setupMaterials();

    /* MOUNT */
    this.experience.scene.add(this.model);

    /* TWEAKS */
    // this.setupTweaks();
  }

  // private setupMaterials() {
  //   const bakedTexture =
  //     this.resources.getAsset<THREE.Texture>("baked_texture");
  //   const goldMatcap = this.resources.getAsset<THREE.Texture>("gold_matcap");
  //   const screenMatcap =
  //     this.resources.getAsset<THREE.Texture>("screen_matcap");

  //   bakedTexture.flipY = false;
  //   bakedTexture.colorSpace = THREE.SRGBColorSpace;
  //   goldMatcap.colorSpace = THREE.SRGBColorSpace;
  //   screenMatcap.colorSpace = THREE.SRGBColorSpace;

  //   const darthVader = this.getMesh("darth_vader");
  //   const light = this.getMesh("hologram_light");
  //   const lightSource = this.getMesh("hologram_light_source");
  //   const holoprojector = this.getMesh("holoprojector_chamber");
  //   const holoprojectorGold = this.getMesh("hologram_chamber_proyector_gold");
  //   const holoprojectorScreen = this.getMesh("holoprojector_controls");

  //   this.vaderHologramEffect = new HologramEffect();
  //   this.lightSpotEffect = new LightSpotEffect();

  //   darthVader.material = this.vaderHologramEffect.material;
  //   light.material = this.lightSpotEffect.material;
  //   lightSource.material = new THREE.MeshBasicMaterial({
  //     color: 0xe0eeff,
  //   });
  //   holoprojector.material = new THREE.MeshBasicMaterial({
  //     map: bakedTexture,
  //   });
  //   holoprojectorGold.material = new THREE.MeshMatcapMaterial({
  //     matcap: goldMatcap,
  //   });
  //   holoprojectorScreen.material = new THREE.MeshMatcapMaterial({
  //     matcap: screenMatcap,
  //   });
  // }

  private setupMaterials() {
    const bakedTexture =
      this.resources.getAsset<THREE.Texture>("baked_texture");

    bakedTexture.flipY = false;
    bakedTexture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: bakedTexture });

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) child.material = material;
    });
  }

  private getMesh(name: string): THREE.Mesh {
    const mesh = this.model.getObjectByName(name);
    if (!mesh || !(mesh instanceof THREE.Mesh)) {
      throw new Error(`Couldn’t find mesh named "${name}"`);
    }
    return mesh;
  }

  private setupTweaks() {
    this.lightSpotEffect?.setupTweaks(this.gui.addFolder("LightSpot"));
  }

  update() {
    this.vaderHologramEffect?.update();
    this.lightSpotEffect?.update();
  }

  dispose() {
    this.vaderHologramEffect?.dispose();
    this.lightSpotEffect?.dispose();
  }
}
export default Ship;
