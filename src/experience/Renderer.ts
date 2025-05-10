import * as THREE from "three";
import Experience from "./Experience";

class Renderer {
  private readonly experience = Experience.getInstance();
  private readonly canvas = this.experience.canvas.domElement;
  private readonly sizes = this.experience.sizes;
  private readonly scene = this.experience.scene;
  private readonly camera = this.experience.camera.instance;

  readonly instance: THREE.WebGLRenderer;

  constructor() {
    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
    this.instance.setClearColor(0x03090f);
  }

  update() {
    this.instance.render(this.scene, this.camera);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  dispose() {
    this.instance.dispose();
  }
}

export default Renderer;
