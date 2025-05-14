import Experience from "../Experience";
import Ship from "./Ship";

class World {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  ship?: Ship;

  constructor() {
    this.resources.on("loadEnd", () => {
      this.ship = new Ship();
    });
  }

  update() {
    this.ship?.update();
  }

  dispose() {
    this.ship?.dispose();
  }
}

export default World;
