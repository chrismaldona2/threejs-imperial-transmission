import * as THREE from "three";
import vertexShader from "../../shaders/screenPattern/vertex.glsl";
import radarFragment from "../../shaders/screenPattern/radarFragment.glsl";
import waveFragment from "../../shaders/screenPattern/waveFragment.glsl";
import orbitalFragments from "../../shaders/screenPattern/orbitalsFragment.glsl";
import Experience from "../Experience";

interface RadarUniformValues {
  uGridColor: THREE.Color;
  uBackgroundColor: THREE.Color;
  uIntensity: number;
  uGridColumns: number;
  uGridRows: number;
  uGridLineThickness: number;
  uDisplacement: THREE.Vector2;
  uSweepSpeed: number;
  uSweepFrequency: number;
  uSweepColor: THREE.Color;
  uAspectRatio: number;
  uTargetPositions: THREE.Vector2[] /* Maximum of 10, but can be modified in the fragment shader */;
  uTargetCount: number /* Same comment as above */;
  uTargetRadius: number;
  uMinTargetRadiusPercentage: number;
  uTargetColor: THREE.Color;
  uTargetBlinkSpeed: number;
}

interface WaveUniformValues {
  uGridColor: THREE.Color;
}

type Options =
  | { variant: "radar"; uniforms?: Partial<RadarUniformValues> }
  | { variant: "wave"; uniforms?: Partial<WaveUniformValues> }
  | { variant: "orbitals"; uniforms?: Partial<RadarUniformValues> };

class ScreenPatternMaterial {
  private readonly experience = Experience.getInstance();
  private readonly timer = this.experience.timer;

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
      fragmentShader:
        this.variant === "radar"
          ? radarFragment
          : this.variant === "wave"
          ? waveFragment
          : orbitalFragments,
      uniforms,
    });
  }

  private getDefaultUniforms(): Record<string, THREE.Uniform> {
    switch (this.variant) {
      case "radar":
        return {
          uTime: new THREE.Uniform(0),
          uIntensity: new THREE.Uniform(1.0),
          uGridColor: new THREE.Uniform(new THREE.Color(0xff2441)),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uGridColumns: new THREE.Uniform(20),
          uGridRows: new THREE.Uniform(8),
          uGridLineThickness: new THREE.Uniform(0.14),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0.62, 0.68)),
          uSweepSpeed: new THREE.Uniform(0.75),
          uSweepFrequency: new THREE.Uniform(2.5),
          uSweepThickness: new THREE.Uniform(0.08),
          uSweepColor: new THREE.Uniform(new THREE.Color(0xff2441)),
          uAspectRatio: new THREE.Uniform(25 / 9),
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
          uTargetCount: new THREE.Uniform(3),
          uTargetRadius: new THREE.Uniform(0.025),
          uMinTargetRadiusPercentage: new THREE.Uniform(0.875),
          uTargetColor: new THREE.Uniform(new THREE.Color(1.0, 0.0, 0.0)),
          uTargetBlinkSpeed: new THREE.Uniform(2),
        };
      case "wave": {
        return {
          uTime: new THREE.Uniform(0),
          uIntensity: new THREE.Uniform(1.0),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uGridColor: new THREE.Uniform(new THREE.Color(0x5570c1)),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0.62, 0.68)),
          uGridColumns: new THREE.Uniform(12),
          uGridRows: new THREE.Uniform(8),
          uGridLineThickness: new THREE.Uniform(0.14),
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
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0.0, 0.0, 0.0)),
          uGridColor: new THREE.Uniform(new THREE.Color("orange")),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0)),
          uIntensity: new THREE.Uniform(1),
          uGridColumns: new THREE.Uniform(10),
          uGridRows: new THREE.Uniform(10),
          uGridLineThickness: new THREE.Uniform(0.2),
          uRingColor: new THREE.Uniform(new THREE.Color("yellow")),
          uTime: new THREE.Uniform(0),
          uRingCount: new THREE.Uniform(5),
          uRingThickness: new THREE.Uniform(0.01),
          uRingRotationSpeed: new THREE.Uniform(0.5),
        };
      }
      default:
        throw new Error(`Unsupported variant: ${this.variant}`);
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
