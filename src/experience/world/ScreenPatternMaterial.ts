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
          uGridColor: new THREE.Uniform(new THREE.Color(0xff2441)),
          uGridIntensity: new THREE.Uniform(1.0),
          uGridColumns: new THREE.Uniform(20),
          uGridRows: new THREE.Uniform(8),
          uGridLinesThickness: new THREE.Uniform(0.14),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0.62, 0.68)),
          uSweepColor: new THREE.Uniform(new THREE.Color(0xff2441)),
          uSweepThickness: new THREE.Uniform(0.08),
          uSweepFrequency: new THREE.Uniform(2.5),
          uSweepSpeed: new THREE.Uniform(0.75),
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
          uTargetAspectScale: new THREE.Uniform(1),
          uTargetBlinkSpeed: new THREE.Uniform(2),
        };
      case "wave": {
        return {
          uTime: new THREE.Uniform(0),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uGridColor: new THREE.Uniform(new THREE.Color(0x5570c1)),
          uGridIntensity: new THREE.Uniform(1.0),
          uGridColumns: new THREE.Uniform(12),
          uGridRows: new THREE.Uniform(8),
          uGridLinesThickness: new THREE.Uniform(0.14),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0.62, 0.68)),
          uSweepColor: new THREE.Uniform(new THREE.Color("green")),
          uSweepThickness: new THREE.Uniform(0.25),
          uSweepFrequency: new THREE.Uniform(4.0),
          uSweepSpeed: new THREE.Uniform(0.5),
          uWaveColor: new THREE.Uniform(new THREE.Color("red")),
          uWaveAmplitude: new THREE.Uniform(0.1),
          uWaveFrequency: new THREE.Uniform(5),
          uWaveThickness: new THREE.Uniform(0.025),
          uWaveSpeed: new THREE.Uniform(0.5),
        };
      }
      case "orbitals": {
        return {
          uTime: new THREE.Uniform(0),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uGridColor: new THREE.Uniform(new THREE.Color("orange")),
          uGridIntensity: new THREE.Uniform(1),
          uGridColumns: new THREE.Uniform(10),
          uGridRows: new THREE.Uniform(10),
          uGridLinesThickness: new THREE.Uniform(0.2),
          uGridDisplacement: new THREE.Uniform(new THREE.Vector2(0)),
          uRingColor: new THREE.Uniform(new THREE.Color("yellow")),
          uRingCount: new THREE.Uniform(2),
          uRings: new THREE.Uniform([
            new THREE.Vector3(0.5, 0.5, 0.45), // x,y pos + radius
            new THREE.Vector3(0.25, 0.5, 0.2),
            new THREE.Vector3(0),
            new THREE.Vector3(0),
            new THREE.Vector3(0),
          ]),
          uRingThickness: new THREE.Uniform(0.01),
          uRingAspectScale: new THREE.Uniform(1),
          uTargetColor: new THREE.Uniform(new THREE.Color("yellow")),
          uTargetCount: new THREE.Uniform(5),
          uTargetPositions: new THREE.Uniform([
            new THREE.Vector2(0.6, 0.55),
            new THREE.Vector2(0.2, 0.8),
            new THREE.Vector2(0.9, 0.65),
            new THREE.Vector2(0.1, 0.4),
            new THREE.Vector2(0.4, 0.25),
          ]),
          uTargetRadius: new THREE.Uniform(0.05),
          uMinTargetRadiusPercentage: new THREE.Uniform(0.8),
          uTargetBlinkSpeed: new THREE.Uniform(2),
          uTargetAspectScale: new THREE.Uniform(16 / 9),
          uLinesThickness: new THREE.Uniform(0.01),
          uLinesAspectScale: new THREE.Uniform(16 / 9),
          uLineAnimationSpeed: new THREE.Uniform(0.25),
        };
      }
      case "targeting": {
        return {
          uTime: new THREE.Uniform(0),
          uBackgroundColor: new THREE.Uniform(new THREE.Color(0x0a070a)),
          uLinesColor: new THREE.Uniform(new THREE.Color(0xdae3ab)),
          uAnimationSpeed: new THREE.Uniform(0.75),
          uLinesThickness: new THREE.Uniform(0.05),
          uRadialLinesCount: new THREE.Uniform(15),
          uLinesAspectScale: new THREE.Uniform(2),
          uBordersColor: new THREE.Uniform(new THREE.Color("green")),
          uBordersThickness: new THREE.Uniform(0.02),
          uBordersMargin: new THREE.Uniform(0.05),
          uCrossColor: new THREE.Uniform(new THREE.Color("orange")),
          uCrossThickness: new THREE.Uniform(0.015),
          uCrossSize: new THREE.Uniform(0.08),
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

  setupTweaks(gui: typeof this.debug) {
    switch (this.variant) {
      case "radar": {
        this.setupCommonTweaks(gui, true, true, true);
        break;
      }
      case "wave": {
        this.setupCommonTweaks(gui, true, true);
        this.setupWaveSpecificTweaks(gui);
        break;
      }
      case "orbitals": {
        this.setupCommonTweaks(gui, true, false, true, 5);
        this.setupOrbitalSpecificTweaks(gui);
        break;
      }

      case "targeting": {
        this.setupCommonTweaks(gui);
        this.setupTargetingSpecificTweaks(gui);
        break;
      }
    }
  }

  private setupWaveSpecificTweaks(gui: typeof this.debug): void {
    const uniforms = this.material.uniforms;
    const colors = {
      wave: uniforms.uWaveColor.value.getHex(),
    };

    const wave = gui.addFolder("Wave");
    wave
      .addColor(colors, "wave")
      .name("Wave Color")
      .onChange(() => {
        uniforms.uWaveColor.value.set(colors.wave);
      });
    wave
      .add(uniforms.uWaveAmplitude, "value")
      .name("Wave Amplitude")
      .min(0)
      .max(1.5)
      .step(0.001);
    wave
      .add(uniforms.uWaveFrequency, "value")
      .name("Wave Frequency")
      .min(0)
      .max(100)
      .step(0.001);
    wave
      .add(uniforms.uWaveThickness, "value")
      .name("Wave Thickness")
      .min(0)
      .max(1)
      .step(0.0001);
    wave
      .add(uniforms.uWaveSpeed, "value")
      .name("Wave Speed")
      .min(0)
      .max(2)
      .step(0.001);
  }

  private setupOrbitalSpecificTweaks(gui: typeof this.debug): void {
    const uniforms = this.material.uniforms;
    const colors = {
      ring: uniforms.uRingColor.value.getHex(),
    };

    const rings = gui.addFolder("Rings");
    rings
      .addColor(colors, "ring")
      .name("Ring Color")
      .onChange(() => {
        uniforms.uRingColor.value.set(colors.ring);
      });
    rings
      .add(uniforms.uRingCount, "value")
      .name("Rings Count")
      .min(0)
      .max(5)
      .step(1);
    const positions = rings.addFolder("Rings Position");
    uniforms.uRings.value.forEach((r: THREE.Vector3, i: number) => {
      const ring = positions.addFolder(`Ring ${i}`);
      ring.add(r, "x").min(0).max(1).step(0.001);
      ring.add(r, "y").min(0).max(1).step(0.001);
      ring.add(r, "z").name("Radius").min(0).max(1).step(0.001);
    });
    rings
      .add(uniforms.uRingThickness, "value")
      .name("Ring Thickness")
      .min(0)
      .max(1)
      .step(0.0001);
    rings
      .add(uniforms.uRingAspectScale, "value")
      .name("Ring Aspect Scale")
      .min(0)
      .max(5)
      .step(0.001);

    const lines = gui.addFolder("Lines");
    lines
      .add(uniforms.uLinesThickness, "value")
      .name("Lines Thickness")
      .min(0)
      .max(1.5)
      .step(0.0001);
    lines
      .add(uniforms.uLinesAspectScale, "value")
      .name("Lines Aspect Scale")
      .min(0)
      .max(5)
      .step(0.001);
    lines
      .add(uniforms.uLineAnimationSpeed, "value")
      .name("Lines Animation Speed")
      .min(0)
      .max(3)
      .step(0.001);
  }

  private setupTargetingSpecificTweaks(gui: typeof this.debug): void {
    const uniforms = this.material.uniforms;
    const colors = {
      lines: uniforms.uLinesColor.value.getHex(),
      borders: uniforms.uBordersColor.value.getHex(),
      cross: uniforms.uCrossColor.value.getHex(),
    };

    const lines = gui.addFolder("Lines");
    lines
      .addColor(colors, "lines")
      .name("Lines Color")
      .onChange(() => {
        uniforms.uLinesColor.value.set(colors.lines);
      });
    lines
      .add(uniforms.uAnimationSpeed, "value")
      .name("Animation Speed")
      .min(0)
      .max(3)
      .step(0.001);
    lines
      .add(uniforms.uLinesThickness, "value")
      .name("Lines Thickness")
      .min(0)
      .max(1.5)
      .step(0.0001);
    lines
      .add(uniforms.uRadialLinesCount, "value")
      .name("Radial Lines Count")
      .min(0)
      .max(30)
      .step(1);
    lines
      .add(uniforms.uLinesAspectScale, "value")
      .name("Lines Aspect Scale")
      .min(0)
      .max(5)
      .step(0.001);

    const borders = gui.addFolder("Borders");
    borders
      .addColor(colors, "borders")
      .name("Borders Color")
      .onChange(() => {
        uniforms.uBordersColor.value.set(colors.borders);
      });
    borders
      .add(uniforms.uBordersThickness, "value")
      .name("Borders Thickness")
      .min(0)
      .max(1.5)
      .step(0.0001);
    borders
      .add(uniforms.uBordersMargin, "value")
      .name("Borders Margin")
      .min(0)
      .max(1)
      .step(0.0001);

    const cross = gui.addFolder("Cross");
    cross
      .addColor(colors, "cross")
      .name("Cross Color")
      .onChange(() => {
        uniforms.uCrossColor.value.set(colors.cross);
      });
    cross
      .add(uniforms.uCrossThickness, "value")
      .name("Cross Thickness")
      .min(0)
      .step(1)
      .step(0.0001);
    cross
      .add(uniforms.uCrossSize, "value")
      .name("Cross Size")
      .min(0)
      .max(1.5)
      .step(0.0001);
  }

  private setupCommonTweaks(
    gui: typeof this.debug,
    hasGrid?: boolean,
    hasSweepLine?: boolean,
    hasTargets?: boolean,
    maxTargets?: number
  ): void {
    const uniforms = this.material.uniforms;
    const colors = {
      background: uniforms.uBackgroundColor.value.getHex(),
      grid: uniforms.uGridColor?.value.getHex(),
      sweepLine: uniforms.uSweepColor?.value.getHex(),
      target: uniforms.uTargetColor?.value.getHex(),
    };

    gui
      .addColor(colors, "background")
      .name("Background Color")
      .onChange(() => {
        uniforms.uBackgroundColor.value.set(colors.background);
      });

    if (hasGrid) {
      const folder = gui.addFolder("Grid");
      folder
        .addColor(colors, "grid")
        .name("Grid Color")
        .onChange(() => {
          uniforms.uGridColor.value.set(colors.grid);
        });
      folder
        .add(uniforms.uGridIntensity, "value")
        .name("Grid Color Intensity")
        .min(0)
        .max(2)
        .step(0.001);
      folder
        .add(uniforms.uGridColumns, "value")
        .name("Grid Columns")
        .min(0)
        .max(30)
        .step(1);
      folder
        .add(uniforms.uGridRows, "value")
        .name("Grid Rows")
        .min(0)
        .max(30)
        .step(1);
      folder
        .add(uniforms.uGridLinesThickness, "value")
        .name("Grid Lines Thickness")
        .min(0)
        .max(1.5)
        .step(0.001);

      const displacement = folder.addFolder("Grid Displacement");
      displacement
        .add(uniforms.uGridDisplacement.value, "x")
        .min(-1)
        .max(1)
        .step(0.001);
      displacement
        .add(uniforms.uGridDisplacement.value, "y")
        .min(-1)
        .max(1)
        .step(0.001);
    }

    if (hasSweepLine) {
      const folder = gui.addFolder("Sweep Line");
      folder
        .addColor(colors, "sweepLine")
        .name("Sweep Line Color")
        .onChange(() => {
          uniforms.uSweepColor.value.set(colors.sweepLine);
        });
      folder
        .add(uniforms.uSweepThickness, "value")
        .name("Sweep Line Thickness")
        .min(0)
        .max(1.5)
        .step(0.0001);
      folder
        .add(uniforms.uSweepFrequency, "value")
        .name("Sweep Frequency")
        .min(0)
        .max(10)
        .step(0.001);
      folder
        .add(uniforms.uSweepSpeed, "value")
        .name("Sweep Speed")
        .min(0)
        .max(3)
        .step(0.001);
    }

    if (hasTargets) {
      const folder = gui.addFolder("Targets");
      folder
        .addColor(colors, "target")
        .name("Target Color")
        .onChange(() => {
          uniforms.uTargetColor.value.set(colors.target);
        });
      folder
        .add(uniforms.uTargetCount, "value")
        .name("Targets Count")
        .min(0)
        .max(maxTargets ?? 10)
        .step(1);
      const positions = folder.addFolder("Target Positions");
      uniforms.uTargetPositions.value.forEach((t: THREE.Vector2, i: number) => {
        const target = positions.addFolder(`Target ${i}`);
        target.add(t, "x").min(0).max(1).step(0.001);
        target.add(t, "y").min(0).max(1).step(0.001);
      });
      folder
        .add(uniforms.uTargetRadius, "value")
        .name("Target Radius")
        .min(0)
        .max(1)
        .step(0.0001);
      folder
        .add(uniforms.uMinTargetRadiusPercentage, "value")
        .name("Min Target Radius %")
        .min(0)
        .max(1)
        .step(0.001);
      folder
        .add(uniforms.uTargetBlinkSpeed, "value")
        .name("Target Animation Speed")
        .min(0)
        .max(8)
        .step(0.001);
      folder
        .add(uniforms.uTargetAspectScale, "value")
        .name("Target Aspect Scale")
        .min(0)
        .max(5)
        .step(0.001);
    }
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
  uGridLinesThickness: number;
  uGridDisplacement: THREE.Vector2;
  uSweepSpeed: number;
  uSweepFrequency: number;
  uSweepThickness: number;
  uSweepColor: THREE.Color;
  uTargetPositions: THREE.Vector2[];
  uTargetCount: number;
  uTargetRadius: number;
  uMinTargetRadiusPercentage: number;
  uTargetColor: THREE.Color;
  uTargetBlinkSpeed: number;
  uTargetAspectScale: number;
}

interface WaveUniformValues {
  uGridColor: THREE.Color;
  uBackgroundColor: THREE.Color;
  uGridIntensity: number;
  uGridDisplacement: THREE.Vector2;
  uGridColumns: number;
  uGridRows: number;
  uGridLinesThickness: number;
  uWaveColor: THREE.Color;
  uWaveAmplitude: number;
  uWaveFrequency: number;
  uWaveThickness: number;
  uWaveSpeed: number;
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
  uGridLinesThickness: number;
  uRingColor: THREE.Color;
  uRings: THREE.Vector3[];
  uRingCount: number;
  uRingThickness: number;
  uRingAspectScale: number;
  uTargetColor: THREE.Color;
  uTargetCount: number;
  uTargetPositions: THREE.Vector2[];
  uTargetRadius: number;
  uMinTargetRadiusPercentage: number;
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

// setupTweaks(gui: typeof this.debug) {
//   switch (this.variant) {
//     case "radar": {
//       const debugObj = {
//         backgroundColor:
//           this.material.uniforms.uBackgroundColor.value.getHex(),
//         gridColor: this.material.uniforms.uGridColor.value.getHex(),
//         sweepLineColor: this.material.uniforms.uSweepColor.value.getHex(),
//         targetColor: this.material.uniforms.uTargetColor.value.getHex(),
//       };

//       /* BACKGROUND COLOR TWEAKS */
//       gui
//         .addColor(debugObj, "backgroundColor")
//         .name("Background Color")
//         .onChange(() => {
//           this.material.uniforms.uBackgroundColor.value.set(
//             debugObj.backgroundColor
//           );
//         });

//       /* GRID TWEAKS */
//       const gridFolder = gui.addFolder("Grid");
//       gridFolder
//         .addColor(debugObj, "gridColor")
//         .name("Grid Color")
//         .onChange(() => {
//           this.material.uniforms.uGridColor.value.set(debugObj.gridColor);
//         });
//       gridFolder
//         .add(this.material.uniforms.uGridIntensity, "value")
//         .name("Grid Intensity")
//         .min(0)
//         .max(2)
//         .step(0.001);
//       gridFolder
//         .add(this.material.uniforms.uGridColumns, "value")
//         .name("Grid Columns")
//         .step(1)
//         .min(0)
//         .max(30);
//       gridFolder
//         .add(this.material.uniforms.uGridRows, "value")
//         .name("Grid Rows")
//         .step(1)
//         .min(0)
//         .max(30);
//       gridFolder
//         .add(this.material.uniforms.uGridLinesThickness, "value")
//         .name("Grid Lines Thickness")
//         .min(0)
//         .max(2)
//         .step(0.001);
//       const displacementFolder = gridFolder.addFolder("Grid Displacement");
//       displacementFolder
//         .add(this.material.uniforms.uGridDisplacement.value, "x")
//         .min(-1)
//         .max(1)
//         .step(0.001);
//       displacementFolder
//         .add(this.material.uniforms.uGridDisplacement.value, "y")
//         .min(-1)
//         .max(1)
//         .step(0.001);

//       /* SWEEP LINE TWEAKS */
//       const sweepLineFolder = gui.addFolder("Sweep Line");
//       sweepLineFolder
//         .add(debugObj, "sweepLineColor")
//         .name("Sweep Line Color")
//         .onChange(() => {
//           this.material.uniforms.uSweepColor.value.set(
//             debugObj.sweepLineColor
//           );
//         });
//       sweepLineFolder
//         .add(this.material.uniforms.uSweepThickness, "value")
//         .name("Sweep Line Thickness")
//         .min(0)
//         .max(2)
//         .step(0.0001);
//       sweepLineFolder
//         .add(this.material.uniforms.uSweepFrequency, "value")
//         .name("Sweep Frequency")
//         .min(0)
//         .max(10)
//         .step(0.001);
//       sweepLineFolder
//         .add(this.material.uniforms.uSweepSpeed, "value")
//         .name("Sweep Speed")
//         .min(0)
//         .max(3)
//         .step(0.001);

//       /* TARGETS TWEAKS */
//       const targetsFolder = gui.addFolder("Targets");
//       targetsFolder
//         .addColor(debugObj, "targetColor")
//         .name("Target Color")
//         .onChange(() => {
//           this.material.uniforms.uTargetColor.value.set(debugObj.targetColor);
//         });
//       targetsFolder
//         .add(this.material.uniforms.uTargetCount, "value")
//         .name("Targets Count")
//         .min(0)
//         .max(10)
//         .step(1);
//       const targetsPosFolder = targetsFolder.addFolder("Target Positions");
//       this.material.uniforms.uTargetPositions.value.forEach(
//         (target: THREE.Vector2, idx: number) => {
//           const targetFolder = targetsPosFolder.addFolder(`Target ${idx}`);
//           targetFolder.add(target, "x").min(0).max(1).step(0.001);
//           targetFolder.add(target, "y").min(0).max(1).step(0.001);
//         }
//       );
//       targetsFolder
//         .add(this.material.uniforms.uTargetRadius, "value")
//         .name("Target Radius")
//         .min(0)
//         .max(1)
//         .step(0.0001);
//       targetsFolder
//         .add(this.material.uniforms.uMinTargetRadiusPercentage, "value")
//         .name("Min Target Radius %")
//         .min(0)
//         .max(1)
//         .step(0.001);
//       targetsFolder
//         .add(this.material.uniforms.uTargetBlinkSpeed, "value")
//         .name("Target Animation Speed")
//         .min(0)
//         .max(8)
//         .step(0.01);
//       targetsFolder
//         .add(this.material.uniforms.uTargetAspectScale, "value")
//         .name("Target Aspect Scale")
//         .min(0)
//         .max(5)
//         .step(0.001);
//       break;
//     }
//     case "wave": {
//       const debugObj = {
//         backgroundColor:
//           this.material.uniforms.uBackgroundColor.value.getHex(),
//         gridColor: this.material.uniforms.uGridColor.value.getHex(),
//         sweepLineColor: this.material.uniforms.uSweepColor.value.getHex(),
//         waveColor: this.material.uniforms.uWaveColor.value.getHex(),
//       };

//       /* BACKGROUND COLOR TWEAK */
//       gui
//         .addColor(debugObj, "backgroundColor")
//         .name("Background Color")
//         .onChange(() => {
//           this.material.uniforms.uBackgroundColor.value.set(
//             debugObj.backgroundColor
//           );
//         });

//       /* GRID TWEAKS */
//       const gridFolder = gui.addFolder("Grid");
//       gridFolder
//         .addColor(debugObj, "gridColor")
//         .name("Grid Color")
//         .onChange(() => {
//           this.material.uniforms.uGridColor.value.set(debugObj.gridColor);
//         });
//       gridFolder
//         .add(this.material.uniforms.uGridIntensity, "value")
//         .name("Grid Intensity")
//         .min(0)
//         .max(2)
//         .step(0.001);
//       gridFolder
//         .add(this.material.uniforms.uGridColumns, "value")
//         .name("Grid Columns")
//         .step(1)
//         .min(0)
//         .max(30);
//       gridFolder
//         .add(this.material.uniforms.uGridRows, "value")
//         .name("Grid Rows")
//         .step(1)
//         .min(0)
//         .max(30);
//       gridFolder
//         .add(this.material.uniforms.uGridLinesThickness, "value")
//         .name("Grid Lines Thickness")
//         .min(0)
//         .max(2)
//         .step(0.001);
//       const displacementFolder = gridFolder.addFolder("Grid Displacement");
//       displacementFolder
//         .add(this.material.uniforms.uGridDisplacement.value, "x")
//         .min(-1)
//         .max(1)
//         .step(0.001);
//       displacementFolder
//         .add(this.material.uniforms.uGridDisplacement.value, "y")
//         .min(-1)
//         .max(1)
//         .step(0.001);

//       /* SWEEP LINE TWEAKS */
//       const sweepLineFolder = gui.addFolder("Sweep Line");
//       sweepLineFolder
//         .add(debugObj, "sweepLineColor")
//         .name("Sweep Line Color")
//         .onChange(() => {
//           this.material.uniforms.uSweepColor.value.set(
//             debugObj.sweepLineColor
//           );
//         });
//       sweepLineFolder
//         .add(this.material.uniforms.uSweepThickness, "value")
//         .name("Sweep Line Thickness")
//         .min(0)
//         .max(2)
//         .step(0.0001);
//       sweepLineFolder
//         .add(this.material.uniforms.uSweepFrequency, "value")
//         .name("Sweep Frequency")
//         .min(0)
//         .max(10)
//         .step(0.001);
//       sweepLineFolder
//         .add(this.material.uniforms.uSweepSpeed, "value")
//         .name("Sweep Speed")
//         .min(0)
//         .max(3)
//         .step(0.001);

//       /* WAVE TWEAKS */
//       const waveFolder = gui.addFolder("Wave");
//       waveFolder
//         .addColor(debugObj, "waveColor")
//         .name("Wave Color")
//         .onChange(() => {
//           this.material.uniforms.uWaveColor.value.set(debugObj.waveColor);
//         });
//       waveFolder
//         .add(this.material.uniforms.uWaveAmplitude, "value")
//         .name("Wave Amplitude")
//         .min(0)
//         .max(1.5)
//         .step(0.001);
//       waveFolder
//         .add(this.material.uniforms.uWaveFrequency, "value")
//         .name("Wave Frequency")
//         .min(0)
//         .max(20)
//         .step(0.001);
//       waveFolder
//         .add(this.material.uniforms.uWaveThickness, "value")
//         .name("Wave Thickness")
//         .min(0)
//         .max(1)
//         .step(0.0001);
//       break;
//     }
//     case "orbitals": {
//       const debugObj = {
//         backgroundColor:
//           this.material.uniforms.uBackgroundColor.value.getHex(),
//         gridColor: this.material.uniforms.uGridColor.value.getHex(),
//         ringColor: this.material.uniforms.uRingColor.value.getHex(),
//         targetColor: this.material.uniforms.uTargetColor.value.getHex(),
//       };

//       /* BACKGROUND COLOR TWEAK */
//       gui
//         .addColor(debugObj, "backgroundColor")
//         .name("Background Color")
//         .onChange(() => {
//           this.material.uniforms.uBackgroundColor.value.set(
//             debugObj.backgroundColor
//           );
//         });

//       /* GRID TWEAKS */
//       const gridFolder = gui.addFolder("Grid");
//       gridFolder
//         .addColor(debugObj, "gridColor")
//         .name("Grid Color")
//         .onChange(() => {
//           this.material.uniforms.uGridColor.value.set(debugObj.gridColor);
//         });
//       gridFolder
//         .add(this.material.uniforms.uGridIntensity, "value")
//         .name("Grid Intensity")
//         .min(0)
//         .max(2)
//         .step(0.001);
//       gridFolder
//         .add(this.material.uniforms.uGridColumns, "value")
//         .name("Grid Columns")
//         .step(1)
//         .min(0)
//         .max(30);
//       gridFolder
//         .add(this.material.uniforms.uGridRows, "value")
//         .name("Grid Rows")
//         .step(1)
//         .min(0)
//         .max(30);
//       gridFolder
//         .add(this.material.uniforms.uGridLinesThickness, "value")
//         .name("Grid Lines Thickness")
//         .min(0)
//         .max(2)
//         .step(0.001);
//       const displacementFolder = gridFolder.addFolder("Grid Displacement");
//       displacementFolder
//         .add(this.material.uniforms.uGridDisplacement.value, "x")
//         .min(-1)
//         .max(1)
//         .step(0.001);
//       displacementFolder
//         .add(this.material.uniforms.uGridDisplacement.value, "y")
//         .min(-1)
//         .max(1)
//         .step(0.001);

//       /* RINGS TWEAKS */
//       const ringsFolder = gui.addFolder("Rings");
//       ringsFolder
//         .addColor(debugObj, "ringColor")
//         .name("Ring Color")
//         .onChange(() => {
//           this.material.uniforms.uRingColor.value.set(debugObj.ringColor);
//         });
//       ringsFolder
//         .add(this.material.uniforms.uRingCount, "value")
//         .name("Rings Count")
//         .min(0)
//         .max(5)
//         .step(1);
//       const ringsConfFolder = ringsFolder.addFolder("Rings");
//       this.material.uniforms.uRings.value.forEach(
//         (ring: THREE.Vector3, idx: number) => {
//           const ringFolder = ringsConfFolder.addFolder(`Ring ${idx}`);
//           ringFolder.add(ring, "x").min(0).max(1).step(0.001);
//           ringFolder.add(ring, "y").min(0).max(1).step(0.001);
//           ringFolder.add(ring, "z").name("Radius").min(0).max(1).step(0.001);
//         }
//       );
//       ringsFolder
//         .add(this.material.uniforms.uRingThickness, "value")
//         .name("Ring Thickness")
//         .min(0)
//         .max(1)
//         .step(0.001);
//       ringsFolder
//         .add(this.material.uniforms.uRingAspectScale, "value")
//         .name("Ring Aspect Scale")
//         .min(0)
//         .max(5)
//         .step(0.001);

//       /* TARGETS TWEAKS */
//       const targetsFolder = gui.addFolder("Targets");
//       targetsFolder
//         .addColor(debugObj, "targetColor")
//         .name("Target Color")
//         .onChange(() => {
//           this.material.uniforms.uTargetColor.value.set(debugObj.targetColor);
//         });
//       targetsFolder
//         .add(this.material.uniforms.uTargetCount, "value")
//         .name("Targets Count")
//         .min(0)
//         .max(10)
//         .step(1);
//       const targetsPosFolder = targetsFolder.addFolder("Target Positions");
//       this.material.uniforms.uTargetPositions.value.forEach(
//         (target: THREE.Vector2, idx: number) => {
//           const targetFolder = targetsPosFolder.addFolder(`Target ${idx}`);
//           targetFolder.add(target, "x").min(0).max(1).step(0.001);
//           targetFolder.add(target, "y").min(0).max(1).step(0.001);
//         }
//       );
//       targetsFolder
//         .add(this.material.uniforms.uTargetRadius, "value")
//         .name("Target Radius")
//         .min(0)
//         .max(1)
//         .step(0.0001);
//       targetsFolder
//         .add(this.material.uniforms.uMinTargetRadiusPercentage, "value")
//         .name("Min Target Radius %")
//         .min(0)
//         .max(1)
//         .step(0.001);
//       targetsFolder
//         .add(this.material.uniforms.uTargetBlinkSpeed, "value")
//         .name("Target Animation Speed")
//         .min(0)
//         .max(8)
//         .step(0.01);
//       targetsFolder
//         .add(this.material.uniforms.uTargetAspectScale, "value")
//         .name("Target Aspect Scale")
//         .min(0)
//         .max(5)
//         .step(0.001);

//       /* LINES TWEAKS */
//       const linesFolder = gui.addFolder("Lines");
//       linesFolder
//         .add(this.material.uniforms.uLinesThickness, "value")
//         .name("Lines Thickness")
//         .min(0)
//         .max(2)
//         .step(0.0001);
//       linesFolder
//         .add(this.material.uniforms.uLinesAspectScale, "value")
//         .name("Lines Aspect Scale")
//         .min(0)
//         .max(5)
//         .step(0.001);
//       linesFolder
//         .add(this.material.uniforms.uLineAnimationSpeed, "value")
//         .name("Line Animation Speed")
//         .min(0)
//         .max(3)
//         .step(0.001);
//       break;
//     }
//     case "targeting": {
//       const debugObj = {
//         backgroundColor:
//           this.material.uniforms.uBackgroundColor.value.getHex(),
//         linesColor: this.material.uniforms.uLinesColor.value.getHex(),
//         bordersColor: this.material.uniforms.uBordersColor.value.getHex(),
//         crossColor: this.material.uniforms.uCrossColor.value.getHex(),
//       };

//       /* BACKGROUND COLOR TWEAK */
//       gui
//         .addColor(debugObj, "backgroundColor")
//         .name("Background Color")
//         .onChange(() => {
//           this.material.uniforms.uBackgroundColor.value.set(
//             debugObj.backgroundColor
//           );
//         });

//       /* LINES TWEAKS */
//       const linesFolder = gui.addFolder("Lines");
//       linesFolder
//         .addColor(debugObj, "linesColor")
//         .name("Lines Color")
//         .onChange(() => {
//           this.material.uniforms.uLinesColor.value.set(debugObj.linesColor);
//         });
//       linesFolder
//         .add(this.material.uniforms.uAnimationSpeed, "value")
//         .name("Animation Speed")
//         .min(0)
//         .max(4)
//         .step(0.001);
//       linesFolder
//         .add(this.material.uniforms.uLinesThickness, "value")
//         .name("Lines Thickness")
//         .min(0)
//         .max(2)
//         .step(0.001);
//       linesFolder
//         .add(this.material.uniforms.uRadialLinesCount, "value")
//         .name("Radial Lines Count")
//         .min(0)
//         .max(30)
//         .step(1);
//       linesFolder
//         .add(this.material.uniforms.uLinesAspectScale, "value")
//         .name("Lines Aspect Scale")
//         .min(0)
//         .max(5)
//         .step(0.001);

//       /* BORDERS TWEAKS */
//       const bordersFolder = gui.addFolder("Borders");
//       bordersFolder
//         .addColor(debugObj, "bordersColor")
//         .name("Borders Color")
//         .onChange(() => {
//           this.material.uniforms.uBordersColor.value.set(
//             debugObj.bordersColor
//           );
//         });
//       bordersFolder
//         .add(this.material.uniforms.uBordersThickness, "value")
//         .name("Borders Thickness")
//         .min(0)
//         .max(1.5)
//         .step(0.0001);
//       bordersFolder
//         .add(this.material.uniforms.uBordersMargin, "value")
//         .name("Borders Margin")
//         .min(0)
//         .max(1)
//         .step(0.0001);

//       /* MIDDLE CROSS TWEAKS */
//       const crossFolder = gui.addFolder("Cross");
//       crossFolder
//         .addColor(debugObj, "crossColor")
//         .name("Cross Color")
//         .onChange(() => {
//           this.material.uniforms.uCrossColor.value.set(debugObj.crossColor);
//         });
//       crossFolder
//         .add(this.material.uniforms.uCrossThickness, "value")
//         .name("Cross Thickness")
//         .min(0)
//         .max(1)
//         .step(0.0001);
//       crossFolder
//         .add(this.material.uniforms.uCrossSize, "value")
//         .name("Cross Size")
//         .min(0)
//         .max(1.5)
//         .step(0.0001);
//       break;
//     }
//   }
// }
