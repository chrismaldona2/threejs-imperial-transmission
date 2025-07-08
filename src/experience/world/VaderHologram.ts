import * as THREE from "three";
import type { GLTF } from "three/examples/jsm/Addons.js";
import Experience from "../Experience";
import HologramMaterial from "./HologramMaterial";
import gsap from "gsap";

class VaderHologram {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  private activeMesh: "highpoly" | "lego";
  private material!: HologramMaterial;
  private highPolyMesh!: THREE.Mesh;
  private legoMesh!: THREE.Mesh;

  private highPolyOriginalScale!: THREE.Vector3;
  private legoOriginalScale!: THREE.Vector3;

  private raycaster: THREE.Raycaster;
  private mousePosition: THREE.Vector2;
  private isAnimating: boolean = false;

  constructor(defaultVariant: "highpoly" | "lego", root: THREE.Object3D) {
    this.activeMesh = defaultVariant;
    this.setupMeshes();
    this.setupMaterial();

    if (this.activeMesh === "highpoly") {
      this.highPolyMesh.visible = true;
      this.legoMesh.visible = false;
    } else {
      this.highPolyMesh.visible = false;
      this.legoMesh.visible = true;
    }

    root.add(this.highPolyMesh, this.legoMesh);

    this.raycaster = new THREE.Raycaster();
    this.mousePosition = new THREE.Vector2();
    this.setupMouseInteraction();
  }

  update() {
    this.material.update();
  }

  dispose() {
    this.highPolyMesh.geometry.dispose();
    this.legoMesh.geometry.dispose();
    this.material.dispose();
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("click", this.handleMouseClick);
  }
  private switchVariant() {
    if (this.isAnimating) return;
    this.isAnimating = true;

    const current =
      this.activeMesh === "highpoly" ? this.highPolyMesh : this.legoMesh;
    const other =
      this.activeMesh === "highpoly" ? this.legoMesh : this.highPolyMesh;
    const currentOriginalScale =
      this.activeMesh === "highpoly"
        ? this.highPolyOriginalScale
        : this.legoOriginalScale;
    const targetOriginalScale =
      this.activeMesh === "highpoly"
        ? this.legoOriginalScale
        : this.highPolyOriginalScale;

    const halfCurrentScale = currentOriginalScale.clone().multiplyScalar(0.5);

    const tl = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false;
        this.activeMesh = this.activeMesh === "highpoly" ? "lego" : "highpoly";
      },
    });

    tl.to(
      this.material.material.uniforms.uOpacity,
      {
        value: 0,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0
    );

    tl.to(
      current.scale,
      {
        x: halfCurrentScale.x,
        y: halfCurrentScale.y,
        z: halfCurrentScale.z,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          current.visible = false;
          other.visible = true;
          const halfTargetScale = targetOriginalScale.clone().multiplyScalar(0);
          other.scale.copy(halfTargetScale);
        },
      },
      0
    );

    tl.to(
      this.material.material.uniforms.uOpacity,
      {
        value: 1,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0.5
    );

    tl.to(
      other.scale,
      {
        x: targetOriginalScale.x,
        y: targetOriginalScale.y,
        z: targetOriginalScale.z,
        duration: 0.5,
        ease: "power2.inOut",
      },
      0.5
    );
  }

  private setupMouseInteraction() {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("click", this.handleMouseClick);
  }

  private handleMouseClick = () => {
    const intersect = this.raycaster.intersectObject(
      this.activeMesh === "highpoly" ? this.highPolyMesh : this.legoMesh
    );
    if (intersect.length > 0) {
      this.switchVariant();
    }
  };

  private handleMouseMove = (event: MouseEvent) => {
    this.mousePosition.x =
      (event.clientX / this.experience.sizes.width) * 2 - 1;
    this.mousePosition.y =
      -(event.clientY / this.experience.sizes.height) * 2 + 1;

    this.raycaster.setFromCamera(
      this.mousePosition,
      this.experience.camera.instance
    );

    const intersect = this.raycaster.intersectObject(
      this.activeMesh === "highpoly" ? this.highPolyMesh : this.legoMesh
    );
    if (intersect.length > 0) {
      document.body.style.cursor = "pointer";
    } else {
      document.body.style.cursor = "default";
    }
  };

  private setupMeshes() {
    this.highPolyMesh = this.getHighpolyMesh();
    this.legoMesh = this.getLegoMesh();
    this.highPolyOriginalScale = this.highPolyMesh.scale.clone();
    this.legoOriginalScale = this.legoMesh.scale.clone();
  }

  private setupMaterial() {
    this.material = new HologramMaterial();
    this.highPolyMesh.material = this.material.material;
    this.legoMesh.material = this.material.material;
  }

  private getHighpolyMesh(): THREE.Mesh {
    const file = this.resources.getAsset<GLTF>("highpoly_vader_model");
    const obj = file.scene.getObjectByName("darth_vader");
    if (!(obj instanceof THREE.Mesh))
      throw new Error("Highpoly Mesh couldn't be found");
    obj.position.y += 0.05;
    return obj;
  }

  private getLegoMesh(): THREE.Mesh {
    const file = this.resources.getAsset<GLTF>("lego_vader_model");
    const obj = file.scene.getObjectByName("darth_vader");
    if (!(obj instanceof THREE.Mesh))
      throw new Error("Lego Mesh couldn't be found");
    obj.position.y += 0.1;
    return obj;
  }
}

export default VaderHologram;
