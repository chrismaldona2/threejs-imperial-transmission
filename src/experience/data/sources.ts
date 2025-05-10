type SinglePathSource = { name: string; path: string };

type GLTFSource = SinglePathSource & { type: "gltf" };
type TextureSource = SinglePathSource & { type: "texture" };

export type Source = GLTFSource | TextureSource;

export const sources: Source[] = [
  {
    name: "darth_vader_model",
    type: "gltf",
    path: "./models/darth_vader.glb",
  },
  {
    name: "noise_texture",
    type: "texture",
    path: "./textures/noise.png",
  },
];
