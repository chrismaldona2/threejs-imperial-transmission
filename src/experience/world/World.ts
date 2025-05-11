import Experience from "../Experience";
import Scene from "./Scene";

class World {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  scene?: Scene;

  constructor() {
    this.resources.on("loadEnd", () => {
      this.scene = new Scene();
    });
  }

  update() {
    this.scene?.update();
  }
}

export default World;
