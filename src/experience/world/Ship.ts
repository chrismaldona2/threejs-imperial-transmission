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
    const textures = {
      part1: this.resources.getAsset<THREE.Texture>("baked_texture_p1"),
      part2: this.resources.getAsset<THREE.Texture>("baked_texture_p2"),
    };

    textures.part1.flipY = false;
    textures.part1.colorSpace = THREE.SRGBColorSpace;
    textures.part2.flipY = false;
    textures.part2.colorSpace = THREE.SRGBColorSpace;

    const materials = {
      part1: new THREE.MeshBasicMaterial({ map: textures.part1 }),
      part2: new THREE.MeshBasicMaterial({ map: textures.part2 }),
    };

    const meshes = {
      part1: this.getMesh("part_1"),
      part2: this.getMesh("part_2"),
    };

    meshes.part1.material = materials.part1;
    meshes.part2.material = materials.part2;
  }

  private getMesh(
    name: string,
    context: THREE.Object3D = this.model
  ): THREE.Mesh {
    const mesh = context.getObjectByName(name);
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
