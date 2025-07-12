import * as THREE from "three";
import Canvas from "./Canvas";
import Timer from "./utils/Timer";
import Sizes from "./utils/Sizes";
import Camera from "./Camera";
import Renderer from "./Renderer";
import World from "./world/World";
import Resources from "./utils/Resources";
import Debug from "./utils/Debug";
import PostProccessing from "./PostProccessing";
import AudioRegistry from "./utils/AudioRegistry";
import LoadingScreen from "./LoadingScreen";

class Experience {
  private static instance: Experience;
  debug: Debug;
  resources: Resources;
  loadingScreen: LoadingScreen;
  timer: Timer;
  sizes: Sizes;
  canvas: Canvas;
  scene: THREE.Scene;
  camera: Camera;
  listener: THREE.AudioListener;
  renderer: Renderer;
  postprocessing: PostProccessing;
  world: World;
  audioRegistry: AudioRegistry;

  private constructor() {
    Experience.instance = this;

    this.debug = new Debug();
    this.resources = new Resources();
    this.loadingScreen = new LoadingScreen();
    this.timer = new Timer();
    this.sizes = new Sizes();
    this.canvas = new Canvas();
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.listener = new THREE.AudioListener();
    this.camera.instance.add(this.listener);
    this.renderer = new Renderer();
    this.postprocessing = new PostProccessing();
    this.world = new World();
    this.audioRegistry = new AudioRegistry();

    this.timer.on("tick", () => this.update());
    this.sizes.on("resize", () => this.resize());
  }

  update() {
    this.world.update();
    this.camera.update();
    this.postprocessing.update();
    // this.renderer.update(); // → Renders the scene. Commented in order to use the postprocessing render instead
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.postprocessing.resize();
  }

  dispose() {
    this.world.dispose();
    this.timer.dispose();
    this.canvas.destroy();
    this.camera.dispose();
    this.renderer.dispose();
    this.debug.dispose();
  }

  static getInstance(): Experience {
    if (!Experience.instance) Experience.instance = new Experience();
    return Experience.instance;
  }
}

export default Experience;
