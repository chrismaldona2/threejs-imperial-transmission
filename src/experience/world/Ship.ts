import * as THREE from "three";
import Experience from "../Experience";
import type GUI from "lil-gui";
import type { GLTF } from "three/examples/jsm/Addons.js";
import HologramMaterial from "./HologramMaterial";
import ScreenPatternMaterial from "./ScreenPatternMaterial";
import SpotLightMaterial from "./SpotLightMaterial";

const materialNames = [
  "bake01",
  "bake02",
  "glass",
  "gold",
  "hologramLightSource",
  "redLights",
  "whiteLights",
  "roundedLights",
  "hologram",
  "leftScreenPattern",
  "spotLight",
] as const;

const textureNames = [
  "baked_texture_part1",
  "baked_texture_part2",
  "gold_matcap_texture",
  "rounded_lights_texture",
] as const;

type MaterialNames = (typeof materialNames)[number];
type TextureNames = (typeof textureNames)[number];

interface MeshMaterialConfig {
  name: string;
  material: MaterialNames;
  root?: THREE.Object3D;
}

class Ship {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly scene = this.experience.scene;
  private readonly debug = this.experience.debug.instance;

  private group = new THREE.Group();
  private shipModel!: THREE.Object3D;
  private vaderModel!: THREE.Object3D;
  private textures!: Record<TextureNames, THREE.Texture>;
  private materials!: Record<MaterialNames, THREE.Material>;

  /* CUSTOM SHADER MATERIALS */
  private hologramMaterial!: HologramMaterial;
  private spotLightMaterial!: SpotLightMaterial;
  private screenPatternsMaterials!: {
    left: ScreenPatternMaterial;
  };

  private tweaksFolder?: GUI;

  constructor() {
    this.group.name = "ShipGroup";
    this.setupModels();
    this.setupTextures();
    this.createMaterials();
    this.applyMaterials();
    this.setupTweaks();
    this.scene.add(this.group);
  }

  private setupModels() {
    /* SHIP */
    const shipGltf = this.resources.getAsset<GLTF>("ship_model");
    this.shipModel = shipGltf.scene;
    this.shipModel.name = "ShipModel";

    /* DARTH VADER */
    const vaderGltf = this.resources.getAsset<GLTF>("darth_vader_model");
    this.vaderModel = vaderGltf.scene;
    this.vaderModel.position.y -= 0.2;
    this.vaderModel.name = "VaderModel";

    this.group.add(this.shipModel, this.vaderModel);
  }

  private setupTextures() {
    this.textures = Object.fromEntries(
      textureNames.map((textureName) => {
        const texture = this.resources.getAsset<THREE.Texture>(textureName);
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        return [textureName, texture];
      })
    ) as Record<TextureNames, THREE.Texture>;
  }

  private createMaterials() {
    /* CUSTOM MATERIALS INITIALIZATION  */
    this.hologramMaterial = new HologramMaterial();
    this.spotLightMaterial = new SpotLightMaterial();
    this.screenPatternsMaterials = {
      left: new ScreenPatternMaterial({ variant: "v1" }),
    };

    /* MATERIALS MAPPING */
    this.materials = {
      // BASIC
      bake01: new THREE.MeshBasicMaterial({
        map: this.textures["baked_texture_part1"],
      }),
      bake02: new THREE.MeshBasicMaterial({
        map: this.textures["baked_texture_part2"],
      }),
      glass: new THREE.MeshPhongMaterial({
        specular: 0xffffff,
        transparent: true,
        opacity: 0.1,
        shininess: 50,
        fog: false,
        depthWrite: false,
        refractionRatio: 0.5,
        combine: THREE.MixOperation,
        reflectivity: 0.38,
      }),
      gold: new THREE.MeshMatcapMaterial({
        matcap: this.textures["gold_matcap_texture"],
      }),
      redLights: new THREE.MeshBasicMaterial({ color: 0xff1331 }),
      whiteLights: new THREE.MeshBasicMaterial({
        color: 0xfefefe,
      }),
      roundedLights: new THREE.MeshBasicMaterial({
        map: this.textures["rounded_lights_texture"],
        transparent: true,
      }),
      hologramLightSource: new THREE.MeshBasicMaterial({
        color: 0xd6efff,
      }),
      // CUSTOM
      hologram: this.hologramMaterial.material,
      spotLight: this.spotLightMaterial.material,
      leftScreenPattern: this.screenPatternsMaterials.left.material,
    };
  }

  private applyMaterials() {
    const meshMaterialsMap: MeshMaterialConfig[] = [
      { name: "part_1", material: "bake01" },
      { name: "part_2", material: "bake02" },
      { name: "glass", material: "glass" },
      { name: "holoprojector_gold", material: "gold" },
      { name: "red_lights", material: "redLights" },
      { name: "white_lights", material: "whiteLights" },
      { name: "rounded_lights", material: "roundedLights" },
      { name: "hologram_source", material: "hologramLightSource" },
      { name: "hologram_light", material: "spotLight" },
      { name: "darth_vader", material: "hologram", root: this.vaderModel },
      { name: "screen_left", material: "leftScreenPattern" },
    ];

    meshMaterialsMap.forEach((record) => {
      const mesh = this.getMesh(record.name, record.root);
      if (mesh) mesh.material = this.materials[record.material];
    });
  }

  private getMesh(
    name: string,
    root: THREE.Object3D = this.shipModel
  ): THREE.Mesh | null {
    const mesh = root.getObjectByName(name);
    if (!mesh || !(mesh instanceof THREE.Mesh)) {
      console.warn(`Lab: couldn’t find mesh named "${name}"`);
      return null;
    }
    return mesh;
  }

  private setupTweaks() {
    this.tweaksFolder = this.debug.addFolder("Ship");
    this.tweaksFolder.open();

    const hologramFolder = this.tweaksFolder.addFolder("Hologram");
    this.hologramMaterial.setupTweaks(hologramFolder);
  }

  update() {
    this.hologramMaterial.update();
    this.spotLightMaterial.update();
    this.screenPatternsMaterials.left.update();
  }

  dispose() {
    this.tweaksFolder?.destroy();
  }
}

export default Ship;
