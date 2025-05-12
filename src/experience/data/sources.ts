type SinglePathSource = { name: string; path: string };

type GLTFSource = SinglePathSource & { type: "gltf" };
type TextureSource = SinglePathSource & { type: "texture" };

export type Source = GLTFSource | TextureSource;

export const sources: Source[] = [
  {
    name: "scene_model",
    type: "gltf",
    path: "./models/scene_model.glb",
  },
  {
    name: "scene_texture",
    type: "texture",
    path: "./textures/baked.png",
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
