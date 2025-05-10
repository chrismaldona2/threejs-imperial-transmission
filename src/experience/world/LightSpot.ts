import Experience from "../Experience";
import * as THREE from "three";
import vertexShader from "../../shaders/lightspot/vertex.glsl";
import fragmentShader from "../../shaders/lightspot/fragment.glsl";

class LightSpot {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;
  private readonly timer = this.experience.timer;
  private readonly scene = this.experience.scene;

  geometry: THREE.ConeGeometry;
  material: THREE.ShaderMaterial;
  mesh: THREE.Mesh;

  constructor() {
    const noiseTexture =
      this.resources.getAsset<THREE.Texture>("noise_texture");
    noiseTexture.wrapS = THREE.RepeatWrapping;
    noiseTexture.wrapT = THREE.RepeatWrapping;

    this.geometry = new THREE.ConeGeometry(0.5, 0.35);
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      depthWrite: false,
      uniforms: {
        uTime: new THREE.Uniform(0),
        uNoiseTexture: new THREE.Uniform(noiseTexture),
        uColor: new THREE.Uniform(new THREE.Color(0x36628e)),
      },
      transparent: true,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.rotation.x += Math.PI;

    this.scene.add(this.mesh);
  }

  update() {
    this.material.uniforms.uTime.value = this.timer.elapsed;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.scene.remove(this.mesh);
  }
}

export default LightSpot;
