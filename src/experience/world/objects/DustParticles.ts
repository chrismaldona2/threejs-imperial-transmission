import * as THREE from "three";
import vertexShader from "../../../shaders/dust_particles/vertex.glsl";
import fragmentShader from "../../../shaders/dust_particles/fragment.glsl";
import Experience from "../../Experience";
import type GUI from "lil-gui";

class DustParticles {
  private readonly experience = Experience.getInstance();
  private readonly timer = this.experience.timer;

  private config: DustParticlesOptions;

  points!: THREE.Points;
  private geometry!: THREE.BufferGeometry;
  private material!: THREE.ShaderMaterial;

  constructor(options?: Partial<DustParticles>) {
    this.config = { ...defaultConfig, ...options };
    this.setupGeometry();
    this.setupMaterial();
    this.setupPoints();
  }

  private setupGeometry() {
    this.geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.config.amount * 3);
    const { min, max } = this.config.boundaries;

    for (let i = 0; i <= this.config.amount; i++) {
      const x = THREE.MathUtils.lerp(min.x, max.x, Math.random());
      const y = THREE.MathUtils.lerp(min.y, max.y, Math.random());
      const z = THREE.MathUtils.lerp(min.z, max.z, Math.random());
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
  }

  private setupMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uColor: new THREE.Uniform(this.config.color),
        uOpacity: new THREE.Uniform(this.config.opacity),
        uDustSize: new THREE.Uniform(this.config.size),
        uDustMovementFrequency: new THREE.Uniform(
          this.config.movementFrequency
        ),
        uDustMovementAmplitude: new THREE.Uniform(
          this.config.movementAmplitude
        ),
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    });
  }

  private setupPoints() {
    this.points = new THREE.Points(this.geometry, this.material);
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.points.parent?.remove(this.points);
  }

  setupTweaks(gui: GUI) {
    const uniforms = this.material.uniforms;
    const controls = {
      color: uniforms.uColor.value.getHex(),
    };
    gui
      .addColor(controls, "color")
      .name("Particles Color")
      .onChange(() => {
        uniforms.uColor.value.set(controls.color);
      });
    gui
      .add(this.config, "amount", 10, 8000, 1)
      .name("Particles Amount")
      .onFinishChange(() => {
        this.geometry.dispose();
        this.setupGeometry();
        this.points.geometry = this.geometry;
      });

    gui.add(uniforms.uOpacity, "value", 0, 1, 0.01).name("Opacity");
    gui.add(uniforms.uDustSize, "value", 0.1, 20, 0.1).name("Point Size");
    gui
      .add(uniforms.uDustMovementAmplitude, "value", 0, 0.2, 0.001)
      .name("Movement Amplitude");
    gui
      .add(uniforms.uDustMovementFrequency, "value", 0, 50, 0.1)
      .name("Movement Frequency");
  }
}

export default DustParticles;

interface DustParticlesOptions {
  amount: number;
  color: THREE.Color;
  opacity: number;
  size: number;
  boundaries: { min: THREE.Vector3; max: THREE.Vector3 };
  movementFrequency: number;
  movementAmplitude: number;
}

const defaultConfig: DustParticlesOptions = {
  amount: 285,
  color: new THREE.Color(0x3e4046),
  opacity: 0.25,
  boundaries: {
    min: new THREE.Vector3(-3, -1, -5),
    max: new THREE.Vector3(2.5, 2.5, 3),
  },
  size: 10,
  movementFrequency: 10,
  movementAmplitude: 0.015,
};
