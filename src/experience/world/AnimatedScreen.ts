import * as THREE from "three";
import vertexShader from "../../shaders/screen/vertex.glsl";
import fragmentShaderV1 from "../../shaders/screen/fragment_v1.glsl";

class AnimatedScreen {
  material: THREE.ShaderMaterial;

  constructor() {
    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader: fragmentShaderV1,
    });
  }
}

export default AnimatedScreen;
