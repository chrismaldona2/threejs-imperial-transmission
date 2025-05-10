import EventEmitter from "./EventEmitter";

class Sizes extends EventEmitter {
  width: number;
  height: number;
  pixelRatio: number;

  constructor() {
    super();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(2, window.devicePixelRatio);
    window.addEventListener("resize", this.resize);
  }

  private resize = () => {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.pixelRatio = Math.min(2, window.devicePixelRatio);
    this.trigger("resize");
  };

  dispose() {
    window.removeEventListener("resize", this.resize);
  }
}

export default Sizes;
