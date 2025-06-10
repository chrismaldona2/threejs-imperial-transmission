import * as THREE from "three";
import Experience from "../Experience";
import HologramEffect from "./HologramEffect";
import type { GLTF } from "three/examples/jsm/Addons.js";
import LightSpotEffect from "./LightSpotEffect";
import ScreenPattern from "./ScreenPattern";

class Ship {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly debug = this.experience.debug.instance;

  private ship: THREE.Object3D;
  private darthVader: THREE.Object3D;

  private hologramEffect?: HologramEffect;
  private lightSpotEffect?: LightSpotEffect;
  private screenPattern_1?: ScreenPattern;
  private screenPattern_2?: ScreenPattern;

  private textures: Record<string, THREE.Texture> = {};
  private materials: Record<string, THREE.Material> = {};

  private tweaks?: typeof this.debug;

  constructor() {
    const shipGltf = this.resources.getAsset<GLTF>("ship_model");
    const darthVaderGltf = this.resources.getAsset<GLTF>("darth_vader_model");
    this.ship = shipGltf.scene;
    this.darthVader = darthVaderGltf.scene;
    this.darthVader.position.y -= 0.15;

    this.setupMaterials();

    this.experience.scene.add(this.ship, this.darthVader);

    this.setupTweaks();
  }

  private setupMaterials() {
    this.lightSpotEffect = new LightSpotEffect();
    this.hologramEffect = new HologramEffect();
    this.screenPattern_1 = new ScreenPattern({ variant: "v1" });
    this.screenPattern_2 = new ScreenPattern({ variant: "v2" });

    this.textures = {
      part1: this.resources.getAsset<THREE.Texture>("baked_texture_part1"),
      part2: this.resources.getAsset<THREE.Texture>("baked_texture_part2"),
      gold: this.resources.getAsset<THREE.Texture>("gold_matcap"),
      screen: this.resources.getAsset<THREE.Texture>("screen_matcap"),
      roundLights: this.resources.getAsset<THREE.Texture>(
        "round_lights_texture"
      ),
    };

    this.textures.part1.flipY = false;
    this.textures.part2.flipY = false;
    this.textures.roundLights.flipY = false;
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
        opacity: 0.1,
        shininess: 50,
        fog: false,
        depthWrite: false,
        refractionRatio: 0.5,
        combine: THREE.MixOperation,
        reflectivity: 0.38,
      }),
      gold: new THREE.MeshMatcapMaterial({ matcap: this.textures.gold }),
      screenLeft: this.screenPattern_1.material,
      screenMiddle: this.screenPattern_2.material,
      screenRight: this.screenPattern_2.material,
      redLights: new THREE.MeshBasicMaterial({ color: 0xff1331 }),
      whiteLights: new THREE.MeshBasicMaterial({ color: 0xfefefe }),
      roundLights: new THREE.MeshBasicMaterial({
        map: this.textures.roundLights,
        transparent: true,
      }),
      hologramSource: new THREE.MeshBasicMaterial({ color: 0xd6efff }),
      hologramLight: this.lightSpotEffect.material,
      hologram: this.hologramEffect.material,
    };

    const meshes = {
      part1: this.getMesh("part_1"),
      part2: this.getMesh("part_2"),
      glass: this.getMesh("glass"),
      lights: {
        red: this.getMesh("red_lights"),
        white: this.getMesh("white_lights"),
        round: this.getMesh("round_lights"),
      },
      screens: {
        middle: this.getMesh("screen_middle"),
        left: this.getMesh("screen_left"),
        right: this.getMesh("screen_right"),
      },
      gold: this.getMesh("holoprojector_gold"),
      hologram: {
        source: this.getMesh("hologram_source"),
        light: this.getMesh("hologram_light"),
        darthVader: this.getMesh("darth_vader", this.darthVader),
      },
    };

    meshes.part1.material = this.materials.part1;
    meshes.part2.material = this.materials.part2;
    meshes.glass.material = this.materials.glass;
    meshes.lights.red.material = this.materials.redLights;
    meshes.lights.white.material = this.materials.whiteLights;

    meshes.screens.left.material = this.materials.screenLeft;
    meshes.screens.middle.material = this.materials.screenMiddle;
    meshes.screens.right.material = this.materials.screenRight;

    meshes.gold.material = this.materials.gold;
    meshes.lights.round.material = this.materials.roundLights;
    meshes.hologram.source.material = this.materials.hologramSource;
    meshes.hologram.light.material = this.materials.hologramLight;
    meshes.hologram.darthVader.material = this.materials.hologram;
  }

  private getMesh(
    name: string,
    context: THREE.Object3D = this.ship
  ): THREE.Mesh {
    const mesh = context.getObjectByName(name);
    if (!mesh || !(mesh instanceof THREE.Mesh)) {
      throw new Error(`Couldn’t find mesh named "${name}"`);
    }
    return mesh;
  }

  private setupTweaks() {
    this.tweaks = this.debug.addFolder("Ship");
    this.tweaks.open();

    if (this.screenPattern_1) {
      const leftScreenTweaks = this.tweaks.addFolder("Left Screen");
      leftScreenTweaks.open();
      this.screenPattern_1.setupTweaks(leftScreenTweaks);
    }

    const holoprojectorTweaks = this.tweaks.addFolder("Holoprojector");
    holoprojectorTweaks.open();

    if (this.lightSpotEffect) {
      const lightSpotTweaks = holoprojectorTweaks.addFolder("Light Spot");

      if (this.materials.hologramSource instanceof THREE.MeshBasicMaterial) {
        const debugObj = {
          color: this.materials.hologramSource.color.getHex(),
        };
        lightSpotTweaks
          .addColor(debugObj, "color")
          .onChange(() => {
            if (
              this.materials.hologramSource instanceof THREE.MeshBasicMaterial
            ) {
              this.materials.hologramSource.color.set(debugObj.color);
            }
          })
          .name("Source Color");
      }

      this.lightSpotEffect.setupTweaks(lightSpotTweaks);
    }

    if (this.hologramEffect) {
      const hologramTweaks = holoprojectorTweaks.addFolder("Hologram");
      this.hologramEffect.setupTweaks(hologramTweaks);
    }
  }

  update() {
    this.hologramEffect?.update();
    this.lightSpotEffect?.update();
    this.screenPattern_1?.update();
  }

  dispose() {
    this.hologramEffect?.dispose();
    this.lightSpotEffect?.dispose();
    this.tweaks?.destroy();
  }
}
export default Ship;
