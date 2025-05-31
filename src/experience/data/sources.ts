type SinglePathSource = { name: string; path: string };

type GLTFSource = SinglePathSource & { type: "gltf" };
type TextureSource = SinglePathSource & { type: "texture" };

export type Source = GLTFSource | TextureSource;

export const sources: Source[] = [
  {
    name: "scene_model",
    type: "gltf",
    path: "./models/scene.glb",
  },
  {
    name: "baked_texture_p1",
    type: "texture",
    path: "./textures/baked_part_1.png",
  },
  {
    name: "baked_texture_p2",
    type: "texture",
    path: "./textures/baked_part_2.png",
  },
  {
    name: "noise_texture",
    type: "texture",
    path: "./textures/noise.png",
  },
  {
    name: "gold_matcap",
    type: "texture",
    path: "./textures/gold_matcap_2.jpg",
  },
  {
    name: "screen_matcap",
    type: "texture",
    path: "./textures/black_screen_matcap_5.jpg",
  },
];
