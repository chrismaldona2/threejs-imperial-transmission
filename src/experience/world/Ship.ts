import * as THREE from "three";
import Experience from "../Experience";
import HologramEffect from "./HologramEffect";
import type { GLTF } from "three/examples/jsm/Addons.js";
import LightSpotEffect from "./LightSpotEffect";

class Ship {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  private model: THREE.Object3D;
  private vaderHologramEffect?: HologramEffect;
  private lightSpotEffect?: LightSpotEffect;

  private textures: Record<string, THREE.Texture> = {};
  private materials: Record<string, THREE.Material> = {};

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

  private setupMaterials() {
    this.textures = {
      part1: this.resources.getAsset<THREE.Texture>("baked_texture_part1"),
      part2: this.resources.getAsset<THREE.Texture>("baked_texture_part2"),
      gold: this.resources.getAsset<THREE.Texture>("gold_matcap"),
      screen: this.resources.getAsset<THREE.Texture>("screen_matcap"),
    };

    this.textures.part1.flipY = false;
    this.textures.part2.flipY = false;
    this.textures.part1.colorSpace = THREE.SRGBColorSpace;
    this.textures.part2.colorSpace = THREE.SRGBColorSpace;
    this.textures.gold.colorSpace = THREE.SRGBColorSpace;
    this.textures.screen.colorSpace = THREE.SRGBColorSpace;

    this.materials = {
      part1: new THREE.MeshBasicMaterial({ map: this.textures.part1 }),
      part2: new THREE.MeshBasicMaterial({ map: this.textures.part2 }),
      glass: new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        transparent: true,
        opacity: 0.225,
        shininess: 50,
        fog: false,
        depthWrite: false,
        side: THREE.DoubleSide,
        refractionRatio: 0.5,
        combine: THREE.MixOperation,
        reflectivity: 0.38,
      }),
      gold: new THREE.MeshMatcapMaterial({ matcap: this.textures.gold }),
      screen: new THREE.MeshMatcapMaterial({ matcap: this.textures.screen }),
      redLights: new THREE.MeshBasicMaterial({ color: 0xff1331 }),
      whiteLights: new THREE.MeshBasicMaterial({ color: 0xfefefe }),
    };

    const meshes = {
      part1: this.getMesh("part_1"),
      part2: this.getMesh("part_2"),
      glass: this.getMesh("glass"),
      lights: {
        red: this.getMesh("red_lights"),
        white: this.getMesh("white_lights"),
      },
      screens: {
        middle: this.getMesh("screen_middle"),
        left: this.getMesh("screen_left"),
        right: this.getMesh("screen_right"),
      },
      gold: this.getMesh("holoprojector_gold"),
    };

    meshes.part1.material = this.materials.part1;
    meshes.part2.material = this.materials.part2;
    meshes.glass.material = this.materials.glass;
    meshes.lights.red.material = this.materials.redLights;
    meshes.lights.white.material = this.materials.whiteLights;
    meshes.screens.middle.material = this.materials.screen;
    meshes.screens.left.material = this.materials.screen;
    meshes.screens.right.material = this.materials.screen;
    meshes.gold.material = this.materials.gold;
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
