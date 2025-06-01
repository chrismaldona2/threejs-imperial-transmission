import Experience from "../Experience";
import Environment from "./Environment";
import Ship from "./Ship";

class World {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  private ship?: Ship;
  private environment?: Environment;

  constructor() {
    this.environment = new Environment();
    this.resources.on("loadEnd", () => {
      this.ship = new Ship();
    });
  }

  update() {
    this.ship?.update();
  }

  dispose() {
    this.ship?.dispose();
    this.environment?.dispose();
  }
}

export default World;
