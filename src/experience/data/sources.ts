type SinglePathSource = { name: string; path: string };
type MultiplePathSource = { name: string; path: string[] };

type GLTFSource = SinglePathSource & { type: "gltf" };
type TextureSource = SinglePathSource & { type: "texture" };
type AudioSource = SinglePathSource & { type: "audio" };
type CubeMapSource = MultiplePathSource & { type: "cubemap" };

export type Source = GLTFSource | TextureSource | CubeMapSource | AudioSource;

export const sources: Source[] = [
  {
    name: "ship_model",
    type: "gltf",
    path: "./models/ship.glb",
  },
  {
    name: "highpoly_vader_model",
    type: "gltf",
    path: "./models/highpoly_vader.glb",
  },
  {
    name: "lego_vader_model",
    type: "gltf",
    path: "./models/lego_vader.glb",
  },
  {
    name: "baked_texture_part1",
    type: "texture",
    path: "./textures/bake/baked_part1_4k_edited.png",
  },
  {
    name: "baked_texture_part2",
    type: "texture",
    path: "./textures/bake/baked_part2_4k.png",
  },
  {
    name: "noise_texture",
    type: "texture",
    path: "./textures/noise.png",
  },
  {
    name: "gold_matcap_texture",
    type: "texture",
    path: "./textures/matcaps/gold_matcap_2.jpg",
  },
  {
    name: "black_screen_matcap_texture",
    type: "texture",
    path: "./textures/matcaps/black_screen_matcap_5.jpg",
  },
  {
    name: "rounded_lights_texture",
    type: "texture",
    path: "./textures/bake/rounded_lights.png",
  },
  {
    name: "space_cubemap",
    type: "cubemap",
    path: [
      "./textures/cubemaps/space_2/px.png",
      "./textures/cubemaps/space_2/nx.png",
      "./textures/cubemaps/space_2/py.png",
      "./textures/cubemaps/space_2/ny.png",
      "./textures/cubemaps/space_2/pz.png",
      "./textures/cubemaps/space_2/nz.png",
    ],
  },
  {
    name: "ambient_sound",
    type: "audio",
    path: "./sounds/empty_room.mp3",
  },
  {
    name: "vader_breathing_audio",
    type: "audio",
    path: "./sounds/vader_breathing.mp3",
  },
  {
    name: "hologram_switch_audio",
    type: "audio",
    path: "./sounds/hologram.mp3",
  },
  {
    name: "droid_march_audio",
    type: "audio",
    path: "./sounds/droid_march.mp3",
  },
  {
    name: "imperial_march_audio",
    type: "audio",
    path: "./sounds/imperial_march.mp3",
  },
];
