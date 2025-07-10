import Experience from "../Experience";
import Environment from "./Environment";
import Ship from "./Ship";
import AudioDebugger from "./AudioDebugger";

class World {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  private ship?: Ship;
  private environment?: Environment;
  private audioDebugger?: AudioDebugger;

  constructor() {
    this.resources.on("loadEnd", () => {
      this.environment = new Environment();
      this.ship = new Ship();
      this.audioDebugger = new AudioDebugger();
    });
  }

  update() {
    this.ship?.update();
  }

  dispose() {
    this.environment?.dispose();
    this.ship?.dispose();
    this.audioDebugger?.dispose();
  }
}

export default World;
