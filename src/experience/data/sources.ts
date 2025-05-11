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
];
