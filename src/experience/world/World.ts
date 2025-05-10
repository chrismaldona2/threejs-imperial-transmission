import Experience from "../Experience";
import LightSpot from "./LightSpot";
import VaderHologram from "./VaderHologram";

class World {
  private readonly experience = Experience.getInstance();
  private readonly resources = this.experience.resources;

  vaderHologram?: VaderHologram;
  lightSpot?: LightSpot;

  constructor() {
    this.resources.on("loadEnd", () => {
      this.vaderHologram = new VaderHologram();
      // this.lightSpot = new LightSpot();
    });
  }

  update() {
    this.vaderHologram?.update();
    // this.lightSpot?.update();
  }
}

export default World;
