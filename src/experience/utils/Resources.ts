import {
  DRACOLoader,
  GLTFLoader,
  type GLTF,
} from "three/examples/jsm/Addons.js";
import { sources, type Source } from "../data/sources";
import EventEmitter from "./EventEmitter";
import { CubeTexture, CubeTextureLoader, Texture, TextureLoader } from "three";

type SupportedLoaders = GLTFLoader | TextureLoader | CubeTextureLoader;
type SupportedFiles = GLTF | Texture | CubeTexture;
type LoadersRecord = Record<Source["type"], SupportedLoaders>;

class Resources extends EventEmitter {
  private readonly sources = sources;

  private toLoad = sources.length;
  private loaded = 0;
  private loaders: LoadersRecord;
  private items: Record<Source["name"], SupportedFiles>;

  constructor() {
    super();
    this.items = {};
    this.loaders = this.initLoaders();
    this.loadAssets();
  }

  private initLoaders(): LoadersRecord {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    return {
      gltf: gltfLoader,
      texture: new TextureLoader(),
      cubemap: new CubeTextureLoader(),
    };
  }

  private loadAssets() {
    this.sources.forEach((src) => {
      switch (src.type) {
        case "gltf": {
          const gltfLoader = this.loaders.gltf as GLTFLoader;
          gltfLoader.load(
            src.path,
            (gltf) => this.handleLoadSuccess(src.name, gltf),
            undefined,
            (error) => this.handleLoadError(src.name, error)
          );
          break;
        }

        case "texture": {
          const texLoader = this.loaders.texture as TextureLoader;
          texLoader.load(
            src.path,
            (tex) => this.handleLoadSuccess(src.name, tex),
            undefined,
            (error) => this.handleLoadError(src.name, error)
          );
          break;
        }

        case "cubemap": {
          const cubeLoader = this.loaders.cubemap as CubeTextureLoader;
          cubeLoader.load(
            src.path,
            (cubeTex) => this.handleLoadSuccess(src.name, cubeTex),
            undefined,
            (error) => this.handleLoadError(src.name, error)
          );
          break;
        }

        default: {
          console.warn(`Unknown source type: ${(src as Source).type}`);
          this.handleFileLoad();
          break;
        }
      }
    });
  }

  private handleLoadSuccess(_name: Source["name"], _file: SupportedFiles) {
    this.items[_name] = _file;
    this.handleFileLoad();
  }

  private handleLoadError(_name: Source["name"], _error: unknown) {
    console.error(`Error loading ${_name}:`, _error);
    this.handleFileLoad();
  }

  private handleFileLoad() {
    this.loaded++;
    this.trigger("fileLoaded");
    if (this.toLoad === this.loaded) this.trigger("loadEnd");
  }

  getAsset<T extends SupportedFiles>(_name: Source["name"]): T {
    const asset = this.items[_name] as T;
    if (!asset) throw new Error(`"${_name}" resource was not found.`);
    return asset;
  }

  dispose() {
    this.off("fileLoaded");
    this.off("loadEnd");
  }
}

export default Resources;
