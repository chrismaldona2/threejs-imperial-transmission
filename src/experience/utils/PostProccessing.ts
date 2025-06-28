import * as THREE from "three";
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
  SMAAPass,
  UnrealBloomPass,
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
      0.2,
      1,
      0.8
    );
    this.composer.addPass(this.bloomPass);

    // this.gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
    // this.composer.addPass(this.gammaCorrectionPass);

    const AcesFilmicShaderPass = {
      uniforms: {
        tDiffuse: { value: null },
        exposure: { value: 1.0 },
      },
      vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
      fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float exposure;
    varying vec2 vUv;

    vec3 RRTAndODTFit(vec3 v) {
      vec3 a = v * (v + 0.0245786) - 0.000090537;
      vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
      return a / b;
    }

    vec3 ACESFilmicToneMapping(vec3 color) {
      const mat3 ACESInputMat = mat3(
        vec3(0.59719, 0.07600, 0.02840),
        vec3(0.35458, 0.90834, 0.13383),
        vec3(0.04823, 0.01566, 0.83777)
      );

      const mat3 ACESOutputMat = mat3(
        vec3(1.60475, -0.10208, -0.00327),
        vec3(-0.53108, 1.10813, -0.07276),
        vec3(-0.07367, -0.00605, 1.07602)
      );

      color *= exposure / 0.6;
      color = ACESInputMat * color;
      color = RRTAndODTFit(color);
      color = ACESOutputMat * color;

      return clamp(color, 0.0, 1.0);
    }

    vec3 linearToSRGB(vec3 color) {
      return pow(color, vec3(1.0 / 2.2));
    }

    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      texel.rgb = ACESFilmicToneMapping(texel.rgb);
      texel.rgb = linearToSRGB(texel.rgb);
      gl_FragColor = texel;
    }
  `,
    };

    this.acesFilmicPass = new ShaderPass(AcesFilmicShaderPass);
    this.composer.addPass(this.acesFilmicPass);

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
