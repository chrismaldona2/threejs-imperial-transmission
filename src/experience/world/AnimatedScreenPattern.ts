import * as THREE from "three";
import vertexShader from "../../shaders/screenPattern/vertex.glsl";
import fragmentShaderV1 from "../../shaders/screenPattern/fragment_v1.glsl";
import fragmentShaderV2 from "../../shaders/screenPattern/fragment_v2.glsl";
import Experience from "../Experience";

interface Options {
  variant: "v1" | "v2";
}

class AnimatedScreenPattern {
  private readonly experience = Experience.getInstance();
  private readonly timer = this.experience.timer;
  private readonly debug = this.experience.debug.instance;

  readonly material: THREE.ShaderMaterial;
  private readonly variant: "v1" | "v2";

  constructor(options: Options = { variant: "v1" }) {
    this.variant = options.variant;
    switch (this.variant) {
      case "v1":
        this.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader: fragmentShaderV1,
          uniforms: {
            uTime: new THREE.Uniform(0),
            uStripeColor: new THREE.Uniform(new THREE.Color(0xff2441)),
            uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
            uIntensity: new THREE.Uniform(1.0),
            uHorizontalStripesAmount: new THREE.Uniform(20),
            uVerticalStripesAmount: new THREE.Uniform(8),
            uStripeThickness: new THREE.Uniform(0.14),
            uDisplacement: new THREE.Uniform(new THREE.Vector2(0.62, 0.68)),
            uSweepSpeed: new THREE.Uniform(0.5),
            uSweepFrequency: new THREE.Uniform(2.0),
            uMeshAspectRatio: new THREE.Uniform(24 / 9),
            uTargetPositions: new THREE.Uniform([
              new THREE.Vector2(0.5, 0.3),
              new THREE.Vector2(0.2, 0.8),
              new THREE.Vector2(0.9, 0.8),
            ]),
            uTargetCount: new THREE.Uniform(3),
            uTargetRadius: new THREE.Uniform(0.025),
            uMinTargetRadiusPct: new THREE.Uniform(0.875),
            uTargetColor: new THREE.Uniform(new THREE.Color(1.0, 0.0, 0.0)),
            uTargetBlinkSpeed: new THREE.Uniform(2),
          },
        });

        break;
      case "v2":
        this.material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader: fragmentShaderV2,
          uniforms: {
            uTime: { value: 0 },
          },
        });
        break;
    }
  }

  setupTweaks(gui: typeof this.debug) {
    switch (this.variant) {
      case "v1":
        const debugObj = {
          stripeColor: this.material.uniforms.uStripeColor.value.getHex(),
          backgroundColor:
            this.material.uniforms.uBackgroundColor.value.getHex(),
        };
        gui
          .addColor(debugObj, "stripeColor")
          .onChange(() => {
            this.material.uniforms.uStripeColor.value.set(debugObj.stripeColor);
          })
          .name("Stripes Color");
        gui.addColor(debugObj, "backgroundColor").onChange(() => {
          this.material.uniforms.uBackgroundColor.value.set(
            debugObj.backgroundColor
          );
        });
        gui
          .add(this.material.uniforms.uIntensity, "value")
          .min(0)
          .max(10)
          .step(0.001)
          .name("Intensity");
        gui
          .add(this.material.uniforms.uStripeThickness, "value")
          .min(0)
          .max(1)
          .step(0.001)
          .name("Stripe Thickness");

        gui
          .add(this.material.uniforms.uHorizontalStripesAmount, "value")
          .min(0)
          .max(50)
          .step(1)
          .name("Horizontal Stripes Amount");
        gui
          .add(this.material.uniforms.uVerticalStripesAmount, "value")
          .min(0)
          .max(50)
          .step(1)
          .name("Vertical Stripes Amount");

        gui
          .add(this.material.uniforms.uDisplacement.value, "x")
          .min(0)
          .max(1)
          .step(0.001)
          .name("Displacement X");
        gui
          .add(this.material.uniforms.uDisplacement.value, "y")
          .min(0)
          .max(1)
          .step(0.001)
          .name("Displacement Y");

        gui
          .add(this.material.uniforms.uSweepSpeed, "value")
          .min(0)
          .max(2)
          .step(0.001)
          .name("Sweep Speed");

        gui
          .add(this.material.uniforms.uSweepFrequency, "value")
          .min(0)
          .max(5)
          .step(0.001)
          .name("Sweep Frequency");
        break;
      case "v2":
    }
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.material.dispose();
  }
}
export default AnimatedScreenPattern;
