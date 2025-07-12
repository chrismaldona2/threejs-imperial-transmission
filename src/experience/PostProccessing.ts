import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  SMAAPass,
  UnrealBloomPass,
} from "three/examples/jsm/Addons.js";
import Experience from "./Experience";
import acesVertexShader from "../shaders/aces_tonemapping/vertex.glsl";
import acesFragmentShader from "../shaders/aces_tonemapping/fragment.glsl";

class PostProccessing {
  private readonly experience = Experience.getInstance();
  private readonly renderer = this.experience.renderer.instance;
  private readonly sizes = this.experience.sizes;
  private readonly camera = this.experience.camera.instance;
  private readonly scene = this.experience.scene;
  private readonly debug = this.experience.debug.instance;

  private renderTarget: THREE.WebGLRenderTarget;
  private composer: EffectComposer;
  private initialPass: RenderPass;
  private bloomPass: UnrealBloomPass;
  private acesFilmicPass: ShaderPass;
  private smaaPass?: SMAAPass;

  constructor() {
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.sizes.width,
      this.sizes.height,
      {
        samples: this.sizes.pixelRatio === 1 ? 2 : 0,
        colorSpace: THREE.SRGBColorSpace,
      }
    );

    this.composer = new EffectComposer(this.renderer, this.renderTarget);
    this.composer.setPixelRatio(this.renderer.getPixelRatio());
    this.composer.setSize(this.sizes.width, this.sizes.height);

    this.initialPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.initialPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.sizes.width, this.sizes.height),
      0.18,
      1.12,
      0.75
    );
    this.composer.addPass(this.bloomPass);

    const AcesFilmicShaderPass = {
      uniforms: {
        tDiffuse: { value: null },
        uExposure: { value: 1.1 },
      },
      vertexShader: acesVertexShader,
      fragmentShader: acesFragmentShader,
    };

    this.acesFilmicPass = new ShaderPass(AcesFilmicShaderPass);
    this.composer.addPass(this.acesFilmicPass);

    /* ↓ For browsers that don't support WebGL2 */
    if (this.sizes.pixelRatio === 1 && !this.renderer.capabilities.isWebGL2) {
      this.smaaPass = new SMAAPass();
      this.composer.addPass(this.smaaPass);
    }

    this.setupTweaks();
  }

  setupTweaks() {
    const folder = this.debug.addFolder("Post Processing");
    folder
      .add(this.acesFilmicPass.uniforms.uExposure, "value")
      .name("Exposure")
      .min(0)
      .max(3)
      .step(0.001);
    folder.add(this.bloomPass, "enabled").name("Bloom Enabled");
    folder
      .add(this.bloomPass, "strength")
      .min(0)
      .max(2)
      .step(0.01)
      .name("Bloom Strength");
    folder
      .add(this.bloomPass, "radius")
      .min(0)
      .max(4)
      .step(0.01)
      .name("Bloom Radius");
    folder
      .add(this.bloomPass, "threshold")
      .min(0)
      .max(2)
      .step(0.01)
      .name("Bloom Threshold");
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
