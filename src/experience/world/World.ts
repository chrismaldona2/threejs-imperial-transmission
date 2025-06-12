import Experience from "../Experience";
import Environment from "./Environment";
import Ship from "./Ship";

class World {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  private ship?: Ship;
  private environment?: Environment;

  constructor() {
    this.resources.on("loadEnd", () => {
      this.environment = new Environment();
      this.ship = new Ship();
      console.log(this.experience.renderer.instance.info);
    });
  }

  update() {
    this.ship?.update();
  }

  dispose() {
    this.environment?.dispose();
    this.ship?.dispose();
  }
}

export default World;
