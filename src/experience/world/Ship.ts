import * as THREE from "three";
import Experience from "../Experience";
import type { GLTF } from "three/examples/jsm/Addons.js";
import ScreenPatternMaterial from "./ScreenPatternMaterial";
import SpotLightMaterial from "./SpotLightMaterial";
import GlassMaterial from "./GlassMaterial";
import VaderHologram from "./VaderHologram";
import type GUI from "lil-gui";
import DustParticles from "./DustParticles";

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
  private textures!: Record<TextureNames, THREE.Texture>;
  private materials!: Record<MaterialNames, THREE.Material>;

  private darthVader!: VaderHologram;
  private dustParticles!: DustParticles;

  /* CUSTOM MATERIALS */
  private glassMaterial!: GlassMaterial;
  private spotLightMaterial!: SpotLightMaterial;
  private screenPatternsMaterials!: {
    left: ScreenPatternMaterial;
    right: {
      "00": ScreenPatternMaterial;
      "01": ScreenPatternMaterial;
      "02": ScreenPatternMaterial;
      "03": ScreenPatternMaterial;
    };
    corner: {
      "00": ScreenPatternMaterial;
      "01": ScreenPatternMaterial;
      "02": ScreenPatternMaterial;
    };
  };

  private tweaks?: GUI;

  constructor() {
    this.group.name = "ShipGroup";
    this.setupModels();
    this.setupTextures();
    this.createMaterials();
    this.applyMaterials();
    this.setupParticles();
    this.setupTweaks();
    this.scene.add(this.group);
  }

  private setupModels() {
    /* SHIP */
    const shipGltf = this.resources.get<GLTF>("ship_model");
    this.shipModel = shipGltf.scene;
    this.shipModel.name = "ShipModel";

    /* DARTH VADER */
    this.darthVader = new VaderHologram("highpoly", this.group);
    this.group.add(this.shipModel);
  }

  private setupTextures() {
    this.textures = Object.fromEntries(
      textureNames.map((textureName) => {
        const texture = this.resources.get<THREE.Texture>(textureName);
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;
        return [textureName, texture];
      })
    ) as Record<TextureNames, THREE.Texture>;
  }

  private createMaterials() {
    /* CUSTOM MATERIALS INITIALIZATION  */
    this.spotLightMaterial = new SpotLightMaterial();

    this.glassMaterial = new GlassMaterial();
    this.screenPatternsMaterials = {
      left: new ScreenPatternMaterial({
        variant: "radar",
        uniforms: {
          uTargetAspectScale: 2.777,
          uTargetCount: 6,
          uBackgroundColor: new THREE.Color(0x110d11),
        },
      }),
      right: {
        "00": new ScreenPatternMaterial({ variant: "orbitals" }),
        "01": new ScreenPatternMaterial({
          variant: "wave",
          uniforms: {
            uSweepColor: new THREE.Color(0x5863fd),
            uSweepFrequency: 3,
            uSweepThickness: 0.6,
            uWaveColor: new THREE.Color(0xb23838),
            uWaveThickness: 0.035,
            uWaveAmplitude: 0.165,
            uGridColor: new THREE.Color(0xc7cdff),
          },
        }),
        "02": new ScreenPatternMaterial({
          variant: "targeting",
          uniforms: {
            uCrossColor: new THREE.Color(0xffc561),
            uBordersColor: new THREE.Color(0xfcffd6),
            uLinesColor: new THREE.Color(0xdae3ab),
          },
        }),
        "03": new ScreenPatternMaterial({
          variant: "radar",
          uniforms: {
            uTargetCount: 3,
            uGridColor: new THREE.Color(0xbec5e5),
            uSweepColor: new THREE.Color(0xbec5e5),
            uTargetColor: new THREE.Color(0xbec5e5),
            uGridColumns: 15,
            uGridRows: 5,
            uTargetRadius: 0.1,
            uTargetAspectScale: 3.888,
          },
        }),
      },
      corner: {
        "00": new ScreenPatternMaterial({
          variant: "radar",
          uniforms: {
            uTargetAspectScale: 6,
            uGridColumns: 46,
            uGridColor: new THREE.Color(0xafb3d9),
            uGridIntensity: 0.76,
            uTargetColor: new THREE.Color(0x326ac3),
            uTargetRadius: 0.047,
            uSweepColor: new THREE.Color(0x7b97bc),
            uSweepFrequency: 3.4,
            uSweepSpeed: 0.3,
            uSweepThickness: 0.025,
            uTargetCount: 7,
          },
        }),
        "01": new ScreenPatternMaterial({
          variant: "wave",
          uniforms: {
            uWaveColor: new THREE.Color(0xf640cb),
            uGridColor: new THREE.Color(0x53ace1),
            uSweepColor: new THREE.Color(0xffffff),
          },
        }),
        "02": new ScreenPatternMaterial({
          variant: "wave",
          uniforms: {
            uWaveColor: new THREE.Color(0xf640cb),
            uGridColor: new THREE.Color(0x5ca0c7),
            uSweepColor: new THREE.Color(0xffffff),
            uWaveAmplitude: 0.175,
            uWaveFrequency: 18.5,
            uWaveThickness: 0.028,
            uWaveSpeed: 0.13,
          },
        }),
      },
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
      glass: this.glassMaterial.material,
      gold: new THREE.MeshMatcapMaterial({
        matcap: this.textures["gold_matcap_texture"],
      }),
      blackScreen: new THREE.MeshMatcapMaterial({
        matcap: this.textures["black_screen_matcap_texture"],
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
      spotLight: this.spotLightMaterial.material,
      radarPattern: this.screenPatternsMaterials.left.material,
      orbitalsPattern: this.screenPatternsMaterials.right["00"].material,
      wavePattern: this.screenPatternsMaterials.right["01"].material,
      targetingPattern: this.screenPatternsMaterials.right["02"].material,
      radarPatternVariant: this.screenPatternsMaterials.right["03"].material,
      radarPatternVariant2: this.screenPatternsMaterials.corner["00"].material,
      wavePatternVariant2: this.screenPatternsMaterials.corner["01"].material,
      wavePatternVariant3: this.screenPatternsMaterials.corner["02"].material,
    };
  }

  private applyMaterials() {
    meshMaterialsMap.forEach(({ name, root, material }) => {
      const mesh = this.getMesh(name, root);
      mesh.material = this.materials[material];
    });
  }

  private setupParticles() {
    this.dustParticles = new DustParticles();
    this.group.add(this.dustParticles.points);
  }

  private getMesh(
    name: string,
    root: THREE.Object3D = this.shipModel
  ): THREE.Mesh {
    const mesh = root.getObjectByName(name);

    if (!mesh || !(mesh instanceof THREE.Mesh))
      throw new Error(`'${name}' Mesh couldn't be found `);

    return mesh;
  }

  private setupTweaks() {
    this.tweaks = this.debug.addFolder("Ship");

    const hologram = this.tweaks.addFolder("Hologram");
    this.darthVader.setupTweaks(hologram);

    const glass = this.tweaks.addFolder("Glass");
    this.glassMaterial.setupTweaks(glass);

    const particles = this.tweaks.addFolder("Particles");
    this.dustParticles.setupTweaks(particles);

    const screens = this.tweaks.addFolder("Screens");
    const leftScreens = screens.addFolder("Left");
    const rightScreens = screens.addFolder("Right");
    const cornerScreens = screens.addFolder("Corner");

    const radar_left = leftScreens.addFolder("Radar");
    this.screenPatternsMaterials.left.setupTweaks(radar_left);
    const orbital_right = rightScreens.addFolder("Orbital");
    const wave_right = rightScreens.addFolder("Wave");
    const targeting_right = rightScreens.addFolder("Targeting");
    const radar_right = rightScreens.addFolder("Radar");
    this.screenPatternsMaterials.right["00"].setupTweaks(orbital_right);
    this.screenPatternsMaterials.right["01"].setupTweaks(wave_right);
    this.screenPatternsMaterials.right["02"].setupTweaks(targeting_right);
    this.screenPatternsMaterials.right["03"].setupTweaks(radar_right);
    const radar_corner = cornerScreens.addFolder("Radar");
    const wave_corner_01 = cornerScreens.addFolder("Wave 01");
    const wave_corner_02 = cornerScreens.addFolder("Wave 02");
    this.screenPatternsMaterials.corner["00"].setupTweaks(radar_corner);
    this.screenPatternsMaterials.corner["01"].setupTweaks(wave_corner_01);
    this.screenPatternsMaterials.corner["02"].setupTweaks(wave_corner_02);
  }

  update() {
    this.darthVader.update();
    this.dustParticles.update();
    this.spotLightMaterial.update();

    const updateGroup = (group: Record<string, ScreenPatternMaterial>) =>
      Object.values(group).forEach((material) => material.update());
    this.screenPatternsMaterials.left.update();

    updateGroup(this.screenPatternsMaterials.right);
    updateGroup(this.screenPatternsMaterials.corner);
  }

  dispose() {
    this.tweaks?.destroy();
    this.darthVader.dispose();
    this.dustParticles.dispose();
    this.glassMaterial.dispose();
    this.spotLightMaterial.dispose();

    // Dispose all screen materials
    const disposeGroup = (group: Record<string, ScreenPatternMaterial>) =>
      Object.values(group).forEach((material) => material.dispose());

    this.screenPatternsMaterials.left.dispose();
    disposeGroup(this.screenPatternsMaterials.right);
    disposeGroup(this.screenPatternsMaterials.corner);
  }
}

export default Ship;

/* CONSTANTS */
const materialNames = [
  "bake01",
  "bake02",
  "glass",
  "gold",
  "blackScreen",
  "hologramLightSource",
  "redLights",
  "whiteLights",
  "roundedLights",
  "spotLight",
  "radarPattern",
  "radarPatternVariant",
  "radarPatternVariant2",
  "wavePattern",
  "wavePatternVariant2",
  "wavePatternVariant3",
  "orbitalsPattern",
  "targetingPattern",
] as const;

const textureNames = [
  "baked_texture_part1",
  "baked_texture_part2",
  "gold_matcap_texture",
  "black_screen_matcap_texture",
  "rounded_lights_texture",
] as const;

const meshMaterialsMap: MeshMaterialConfig[] = [
  { name: "part_1", material: "bake01" },
  { name: "part_2", material: "bake02" },
  { name: "glass", material: "glass" },
  { name: "holoprojector_gold", material: "gold" },
  { name: "holoprojector_screen", material: "blackScreen" },
  { name: "red_lights", material: "redLights" },
  { name: "white_lights", material: "whiteLights" },
  { name: "rounded_lights", material: "roundedLights" },
  { name: "hologram_source", material: "hologramLightSource" },
  { name: "hologram_light", material: "spotLight" },
  { name: "left_board_screen", material: "radarPattern" },
  { name: "right_board_screen", material: "orbitalsPattern" },
  { name: "right_board_screen001", material: "wavePattern" },
  { name: "right_board_screen002", material: "radarPatternVariant" },
  { name: "right_board_screen003", material: "targetingPattern" },
  { name: "corner_board_screen", material: "radarPatternVariant2" },
  { name: "corner_board_screen001", material: "wavePatternVariant2" },
  { name: "corner_board_screen002", material: "wavePatternVariant3" },
] as const;
