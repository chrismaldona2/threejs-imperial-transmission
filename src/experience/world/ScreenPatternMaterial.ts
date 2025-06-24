import * as THREE from "three";
import Experience from "../Experience";
import vertexShader from "../../shaders/screenPattern/vertex.glsl";
import radarFragment from "../../shaders/screenPattern/radarFragment.glsl";
import waveFragment from "../../shaders/screenPattern/waveFragment.glsl";
import orbitalFragments from "../../shaders/screenPattern/orbitalsFragment.glsl";
import targetingFragment from "../../shaders/screenPattern/targetingFragment.glsl";

class ScreenPatternMaterial {
  private readonly experience = Experience.getInstance();
  private readonly timer = this.experience.timer;
  private readonly debug = this.experience.debug.instance;

  readonly material: THREE.ShaderMaterial;
  private readonly variant: Options["variant"];

  constructor(options: Options) {
    this.variant = options.variant;

    const uniforms = this.getDefaultUniforms();

    if (options.uniforms) {
      for (const [key, value] of Object.entries(options.uniforms)) {
        if (uniforms[key]) {
          uniforms[key].value = value;
        }
      }
    }

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fragmentShaderMap[this.variant],
      uniforms,
    });
  }

  private getDefaultUniforms(): Record<string, THREE.Uniform> {
    switch (this.variant) {
      case "radar":
        return {
          uTime: new THREE.Uniform(0),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uGridIntensity: new THREE.Uniform(1.0),
          uGridColor: new THREE.Uniform(new THREE.Color(0xff2441)),
          uGridColumns: new THREE.Uniform(20),
          uGridRows: new THREE.Uniform(8),
          uGridLinesThickness: new THREE.Uniform(0.14),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0.62, 0.68)),
          uSweepColor: new THREE.Uniform(new THREE.Color(0xff2441)),
          uSweepThickness: new THREE.Uniform(0.08),
          uSweepFrequency: new THREE.Uniform(2.5),
          uSweepSpeed: new THREE.Uniform(0.75),
          uAspectScale: new THREE.Uniform(1),
          uTargetColor: new THREE.Uniform(new THREE.Color(1.0, 0.0, 0.0)),
          uTargetCount: new THREE.Uniform(3),
          uTargetPositions: new THREE.Uniform([
            new THREE.Vector2(0.5, 0.3),
            new THREE.Vector2(0.2, 0.8),
            new THREE.Vector2(0.9, 0.8),
            new THREE.Vector2(0),
            new THREE.Vector2(0),
            new THREE.Vector2(0),
            new THREE.Vector2(0),
            new THREE.Vector2(0),
            new THREE.Vector2(0),
            new THREE.Vector2(0),
          ]),
          uTargetRadius: new THREE.Uniform(0.025),
          uMinTargetRadiusPercentage: new THREE.Uniform(0.875),
          uTargetBlinkSpeed: new THREE.Uniform(2),
        };
      case "wave": {
        return {
          uTime: new THREE.Uniform(0),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uGridIntensity: new THREE.Uniform(1.0),
          uGridColor: new THREE.Uniform(new THREE.Color(0x5570c1)),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0.62, 0.68)),
          uGridColumns: new THREE.Uniform(12),
          uGridRows: new THREE.Uniform(8),
          uGridLinesThickness: new THREE.Uniform(0.14),
          uWaveAmplitude: new THREE.Uniform(0.1),
          uWaveFrequency: new THREE.Uniform(5),
          uWaveThickness: new THREE.Uniform(0.025),
          uWaveColor: new THREE.Uniform(new THREE.Color("red")),
          uSweepSpeed: new THREE.Uniform(0.5),
          uSweepFrequency: new THREE.Uniform(4.0),
          uSweepThickness: new THREE.Uniform(0.25),
          uSweepColor: new THREE.Uniform(new THREE.Color("green")),
        };
      }
      case "orbitals": {
        return {
          uTime: new THREE.Uniform(0),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uGridColor: new THREE.Uniform(new THREE.Color("orange")),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0)),
          uGridIntensity: new THREE.Uniform(1),
          uGridColumns: new THREE.Uniform(10),
          uGridRows: new THREE.Uniform(10),
          uGridLinesThickness: new THREE.Uniform(0.2),
          uRingColor: new THREE.Uniform(new THREE.Color("yellow")),
          uRingThickness: new THREE.Uniform(0.01),
          uRingAspectScale: new THREE.Uniform(1),
          uTargetPositions: new THREE.Uniform([
            new THREE.Vector2(0.6, 0.55),
            new THREE.Vector2(0.2, 0.8),
            new THREE.Vector2(0.9, 0.65),
            new THREE.Vector2(0.1, 0.4),
            new THREE.Vector2(0.4, 0.25),
          ]),
          uTargetCount: new THREE.Uniform(5),
          uTargetRadius: new THREE.Uniform(0.05),
          uMinTargetRadiusPercentage: new THREE.Uniform(0.8),
          uTargetColor: new THREE.Uniform(new THREE.Color("yellow")),
          uTargetBlinkSpeed: new THREE.Uniform(2),
          uTargetAspectScale: new THREE.Uniform(16 / 9),
          uLineAnimationSpeed: new THREE.Uniform(0.25),
          uLinesAspectScale: new THREE.Uniform(16 / 9),
          uLinesThickness: new THREE.Uniform(0.01),
        };
      }
      case "targeting": {
        return {
          uTime: new THREE.Uniform(0),
          uAspectScale: new THREE.Uniform(2),
          uAnimationSpeed: new THREE.Uniform(0.75),
          uRadialLinesCount: new THREE.Uniform(15),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uLinesColor: new THREE.Uniform(new THREE.Color(0xdae3ab)),
          uLinesThickness: new THREE.Uniform(0.05),
          uBordersThickness: new THREE.Uniform(0.02),
          uBordersMargin: new THREE.Uniform(0.05),
          uBordersColor: new THREE.Uniform(new THREE.Color("green")),
          uCrossThickness: new THREE.Uniform(0.015),
          uCrossSize: new THREE.Uniform(0.08),
          uCrossColor: new THREE.Uniform(new THREE.Color("orange")),
        };
      }
      default:
        throw new Error(`Unsupported variant: ${this.variant}`);
    }
  }

  setupTweaks(gui: typeof this.debug) {
    switch (this.variant) {
      case "radar": {
        const debugObj = {
          backgroundColor:
            this.material.uniforms.uBackgroundColor.value.getHex(),
          gridColor: this.material.uniforms.uGridColor.value.getHex(),
          sweepLineColor: this.material.uniforms.uSweepColor.value.getHex(),
          targetsColor: this.material.uniforms.uTargetColor.value.getHex(),
        };
        gui
          .addColor(debugObj, "backgroundColor")
          .name("Background Color")
          .onChange(() => {
            this.material.uniforms.uBackgroundColor.value.set(
              debugObj.backgroundColor
            );
          });
        gui
          .addColor(debugObj, "gridColor")
          .name("Grid Color")
          .onChange(() => {
            this.material.uniforms.uGridColor.value.set(debugObj.gridColor);
          });
        gui
          .add(this.material.uniforms.uGridColumns, "value")
          .name("Grid Columns")
          .step(1)
          .min(0)
          .max(30);
        gui
          .add(this.material.uniforms.uGridRows, "value")
          .name("Grid Rows")
          .step(1)
          .min(0)
          .max(30);
        gui
          .add(this.material.uniforms.uGridLinesThickness, "value")
          .name("Grid Lines Thickness")
          .min(0)
          .max(2)
          .step(0.001);
        const displacementFolder = gui.addFolder("Grid Displacement");
        displacementFolder
          .add(this.material.uniforms.uGridDisplacement.value, "x")
          .min(-1)
          .max(1)
          .step(0.001);
        displacementFolder
          .add(this.material.uniforms.uGridDisplacement.value, "y")
          .min(-1)
          .max(1)
          .step(0.001);
        gui
          .add(debugObj, "sweepLineColor")
          .name("Sweep Line Color")
          .onChange(() => {
            this.material.uniforms.uSweepColor.value.set(
              debugObj.sweepLineColor
            );
          });
        gui
          .add(this.material.uniforms.uSweepThickness, "value")
          .name("Sweep Line Thickness")
          .min(0)
          .max(2)
          .step(0.0001);
        gui
          .add(this.material.uniforms.uSweepFrequency, "value")
          .name("Sweep Frequency")
          .min(0)
          .max(10)
          .step(0.001);
        gui
          .add(this.material.uniforms.uSweepSpeed, "value")
          .name("Sweep Speed")
          .min(0)
          .max(3)
          .step(0.001);
        gui
          .add(this.material.uniforms.uAspectScale, "value")
          .name("Aspect Scale")
          .min(0)
          .max(5)
          .step(0.001);
        gui
          .addColor(debugObj, "targetsColor")
          .name("Targets Color")
          .onChange(() => {
            this.material.uniforms.uTargetColor.value.set(
              debugObj.targetsColor
            );
          });
        gui
          .add(this.material.uniforms.uTargetCount, "value")
          .name("Targets Count")
          .min(0)
          .max(10)
          .step(1);
        const targetsFolder = gui.addFolder("Targets");
        this.material.uniforms.uTargetPositions.value.forEach(
          (target: THREE.Vector2, idx: number) => {
            const targetFolder = targetsFolder.addFolder(`Target ${idx}`);
            targetFolder.add(target, "x").min(-1).max(1).step(0.001);
            targetFolder.add(target, "y").min(-1).max(1).step(0.001);
          }
        );
        gui
          .add(this.material.uniforms.uTargetRadius, "value")
          .name("Target Radius")
          .min(0)
          .max(1)
          .step(0.0001);
        gui
          .add(this.material.uniforms.uMinTargetRadiusPercentage, "value")
          .name("Min Target Radius %")
          .min(0)
          .max(1)
          .step(0.001);
        gui
          .add(this.material.uniforms.uTargetBlinkSpeed, "value")
          .name("Target Animation Speed")
          .min(0)
          .max(8)
          .step(0.01);
        break;
      }
      case "wave": {
        break;
      }
      case "orbitals": {
        break;
      }
      case "targeting": {
        break;
      }
    }
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.material.dispose();
  }
}

export default ScreenPatternMaterial;

/* TYPES */
const fragmentShaderMap: Record<Options["variant"], string> = {
  radar: radarFragment,
  wave: waveFragment,
  orbitals: orbitalFragments,
  targeting: targetingFragment,
} as const;

interface RadarUniformValues {
  uGridColor: THREE.Color;
  uBackgroundColor: THREE.Color;
  uGridIntensity: number;
  uGridColumns: number;
  uGridRows: number;
  uGridLineThickness: number;
  uGridDisplacement: THREE.Vector2;
  uSweepSpeed: number;
  uSweepFrequency: number;
  uSweepThickness: number;
  uSweepColor: THREE.Color;
  uAspectScale: number;
  uTargetPositions: THREE.Vector2[];
  uTargetCount: number;
  uTargetRadius: number;
  uMinTargetRadiusPercentage: number;
  uTargetColor: THREE.Color;
  uTargetBlinkSpeed: number;
}

interface WaveUniformValues {
  uGridColor: THREE.Color;
  uBackgroundColor: THREE.Color;
  uGridIntensity: number;
  uGridDisplacement: THREE.Vector2;
  uGridColumns: number;
  uGridRows: number;
  uGridLineThickness: number;
  uWaveAmplitude: number;
  uWaveFrequency: number;
  uWaveThickness: number;
  uWaveColor: THREE.Color;
  uSweepSpeed: number;
  uSweepFrequency: number;
  uSweepThickness: number;
  uSweepColor: THREE.Color;
}

interface OrbitalsUniformValues {
  uGridColor: THREE.Color;
  uBackgroundColor: THREE.Color;
  uGridDisplacement: THREE.Vector2;
  uGridIntensity: number;
  uGridColumns: number;
  uGridRows: number;
  uGridLineThickness: number;
  uRingColor: THREE.Color;
  uRingThickness: number;
  uRingAspectScale: number;
  uTargetPositions: THREE.Vector2[];
  uTargetCount: number;
  uTargetRadius: number;
  uMinTargetRadiusPercentage: number;
  uTargetColor: THREE.Color;
  uTargetBlinkSpeed: number;
  uTargetAspectScale: number;
  uLineAnimationSpeed: number;
  uLinesAspectScale: number;
  uLinesThickness: number;
}

interface TargetingUniformValues {
  uAspectScale: number;
  uAnimationSpeed: number;
  uRadialLinesCount: number;
  uBackgroundColor: THREE.Color;
  uLinesColor: THREE.Color;
  uLinesThickness: number;
  uBordersThickness: number;
  uBordersMargin: number;
  uBordersColor: THREE.Color;
  uCrossThickness: number;
  uCrossSize: number;
  uCrossColor: THREE.Color;
}

type Options =
  | { variant: "radar"; uniforms?: Partial<RadarUniformValues> }
  | { variant: "wave"; uniforms?: Partial<WaveUniformValues> }
  | { variant: "orbitals"; uniforms?: Partial<OrbitalsUniformValues> }
  | { variant: "targeting"; uniforms?: Partial<TargetingUniformValues> };
