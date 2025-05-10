import { GLTFLoader, type GLTF } from "three/examples/jsm/Addons.js";
import { sources, type Source } from "../data/sources";
import EventEmitter from "./EventEmitter";
import { Texture, TextureLoader } from "three";

type SupportedLoaders = GLTFLoader | TextureLoader;
type SupportedFiles = GLTF | Texture;
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
    return {
      gltf: new GLTFLoader(),
      texture: new TextureLoader(),
    };
  }

  private loadAssets() {
    this.sources.forEach((src) => {
      this.loaders[src.type].load(
        src.path,
        (file) => this.handleLoadSuccess(src.name, file),
        undefined,
        (error) => this.handleLoadError(src.name, error)
      );
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
