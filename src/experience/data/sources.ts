type SinglePathSource = { name: string; path: string };
type MultiplePathSource = { name: string; path: string[] };

type GLTFSource = SinglePathSource & { type: "gltf" };
type TextureSource = SinglePathSource & { type: "texture" };
type CubeMapSource = MultiplePathSource & { type: "cubemap" };

export type Source = GLTFSource | TextureSource | CubeMapSource;

export const sources: Source[] = [
  {
    name: "scene_model",
    type: "gltf",
    path: "./models/scene.glb",
  },
  {
    name: "baked_texture_part1",
    type: "texture",
    path: "./textures/bake/baked_part1_4k.png",
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
    name: "gold_matcap",
    type: "texture",
    path: "./textures/matcaps/gold_matcap_2.jpg",
  },
  {
    name: "screen_matcap",
    type: "texture",
    path: "./textures/matcaps/black_screen_matcap_5.jpg",
  },
  {
    name: "round_lights_texture",
    type: "texture",
    path: "./textures/bake/round_lights.png",
  },
  {
    name: "space_cubemap",
    type: "cubemap",
    path: [
      "./textures/cubemaps/space/px.png",
      "./textures/cubemaps/space/nx.png",
      "./textures/cubemaps/space/py.png",
      "./textures/cubemaps/space/ny.png",
      "./textures/cubemaps/space/pz.png",
      "./textures/cubemaps/space/nz.png",
    ],
  },
];
