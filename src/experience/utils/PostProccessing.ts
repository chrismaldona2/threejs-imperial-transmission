import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  GammaCorrectionShader,
  SMAAPass,
} from "three/examples/jsm/Addons.js";
import Experience from "../Experience";

class PostProccessing {
  private readonly experience = Experience.getInstance();
  private readonly renderer = this.experience.renderer.instance;
  private readonly sizes = this.experience.sizes;
  private readonly camera = this.experience.camera.instance;
  private readonly scene = this.experience.scene;

  private renderTarget: THREE.WebGLRenderTarget;
  private composer: EffectComposer;
  private initialPass: RenderPass;
  private gammaCorrectionPass: ShaderPass;
  private smaaPass?: SMAAPass;

  constructor() {
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
      {
        samples: this.renderer.getPixelRatio() === 1 ? 2 : 0,
        colorSpace: THREE.SRGBColorSpace,
      }
    );

    this.composer = new EffectComposer(this.renderer, this.renderTarget);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.composer.setSize(this.sizes.width, this.sizes.height);

    this.initialPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.initialPass);

    this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    this.composer.addPass(this.gammaCorrectionPass);

    /* ↓ For browsers that don't support WebGL2 */
    if (this.sizes.pixelRatio === 1 && !this.renderer.capabilities.isWebGL2) {
      this.smaaPass = new SMAAPass();
      this.composer.addPass(this.smaaPass);
    }
  }

  update() {
    this.composer.render();
  }

  resize() {
    this.renderTarget.samples = this.sizes.pixelRatio === 1 ? 2 : 0;
    this.composer.setPixelRatio(this.sizes.pixelRatio);
    this.composer.setSize(this.sizes.width, this.sizes.height);
  }
}

export default PostProccessing;
