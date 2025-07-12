type SinglePathSource = { name: string; path: string };
type MultiplePathSource = { name: string; paths: string[] };

type GLTFSource = SinglePathSource & { type: "gltf" };
type TextureSource = SinglePathSource & {
  type: "texture";
  fallbackPath?: string;
};
type AudioSource = SinglePathSource & { type: "audio" };
type CubeMapSource = MultiplePathSource & {
  type: "cubemap";
  fallbackPaths?: string[];
};

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
    name: "funko_vader_model",
    type: "gltf",
    path: "./models/funko_vader.glb",
  },
  {
    name: "baked_texture_part1",
    type: "texture",
    path: "./textures/bake/baked_p1.webp",
    fallbackPath: "./textures/bake/baked_p1.png",
  },
  {
    name: "baked_texture_part2",
    type: "texture",
    path: "./textures/bake/baked_p2.webp",
    fallbackPath: "./textures/bake/baked_p2.png",
  },
  {
    name: "rounded_lights_texture",
    type: "texture",
    path: "./textures/bake/rounded_lights.webp",
    fallbackPath: "./textures/bake/rounded_lights.png",
  },
  {
    name: "noise_texture",
    type: "texture",
    path: "./textures/noise.webp",
    fallbackPath: "./textures/noise.png",
  },
  {
    name: "gold_matcap_texture",
    type: "texture",
    path: "./textures/matcaps/gold.webp",
    fallbackPath: "./textures/matcaps/gold.jpg",
  },
  {
    name: "black_screen_matcap_texture",
    type: "texture",
    path: "./textures/matcaps/black_screen.webp",
    fallbackPath: "./textures/matcaps/black_screen.jpg",
  },
  {
    name: "space_cubemap",
    type: "cubemap",
    paths: [
      "./textures/cubemaps/space/px.webp",
      "./textures/cubemaps/space/nx.webp",
      "./textures/cubemaps/space/py.webp",
      "./textures/cubemaps/space/ny.webp",
      "./textures/cubemaps/space/pz.webp",
      "./textures/cubemaps/space/nz.webp",
    ],
    fallbackPaths: [
      "./textures/cubemaps/space/px.png",
      "./textures/cubemaps/space/nx.png",
      "./textures/cubemaps/space/py.png",
      "./textures/cubemaps/space/ny.png",
      "./textures/cubemaps/space/pz.png",
      "./textures/cubemaps/space/nz.png",
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
